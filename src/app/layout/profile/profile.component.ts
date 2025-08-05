import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userRole: 'EVENT_ORGANIZER' | 'SERVICE_PRODUCT_PROVIDER' | 'ADMIN' = 'EVENT_ORGANIZER' 

  userInfo = { firstName: '', lastName: '', email: '', profilePicture: '', address: '', phoneNumber: '' };
  companyInfo = { companyName: '', companyDescription: '' };
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  favoriteEvents: any[] = [];
  favoriteServices: any[] = [];
  upcomingEvents: any[] = [];
  serviceCategories: any[] = [];
  eventTypes: any[] = [];
  selectedEventTypes: any[] = [];

  constructor(private profileService: ProfileService, private snackBar: MatSnackBar, private dialog: MatDialog,) {
    this.loadUserData();
  }

  loadUserData() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID not found in local storage.');
      return;
    } else {
      this.profileService.getUserData(Number(userId)).subscribe({
        next: (data) => {
          console.log('User data loaded:', data);
          this.userRole = data.userRole;
          this.userInfo = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            profilePicture: data.profilePicture,
            phoneNumber: data.phoneNumber,
            address: data.address
          };
          this.favoriteEvents = data.favoriteEvents;
          this.favoriteServices = data.favoriteServices;
          this.upcomingEvents = data.upcomingEvents;

          if (data.userRole === 'SERVICE_PRODUCT_PROVIDER') {
            this.profileService.getCompanyData(Number(userId)).subscribe({
              next: (companyData) => {
                console.log('Company data loaded:', companyData);
                this.companyInfo = {
                  companyName: companyData.companyName,
                  companyDescription: companyData.companyDescription,
                };
                this.serviceCategories = companyData.serviceCategories;
                this.eventTypes = companyData.eventTypes;
                this.selectedEventTypes = companyData.selectedEventTypes;
              },
              error: (err) => {
                console.error('Error loading company data:', err);
              }
            });
          }
        },
        error: (err) => {
          console.error('Error loading user data:', err);
        }
      });
    }
  }

  updatePersonalInfo() {
    if (localStorage.getItem('userId') === null) {
      console.error('User ID not found in local storage.');
      return;
    }
    this.profileService.updatePersonalInfo(this.userInfo, localStorage.getItem('userId')!).subscribe({
      next: (data) => {
        this.snackBar.open('Personal information updated successfully', 'Close', {
          duration: 4000,
          });
          this.userInfo = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            profilePicture: data.profilePicture,
            phoneNumber: data.phoneNumber,
            address: data.address,
          };
      },
    });
  }

  updateCompanyInfo() {
    if (this.userRole !== 'SERVICE_PRODUCT_PROVIDER') return;
    console.log('Updating company info:', this.companyInfo);
        if (localStorage.getItem('userId') === null) {
      console.error('User ID not found in local storage.');
      return;
    }
    this.profileService.updateCompanyInfo(this.companyInfo, localStorage.getItem('userId')!).subscribe({
      next: (data) => {
        this.snackBar.open('Personal information updated successfully', 'Close', {
          duration: 4000,
          });
          this.companyInfo = {
            companyName: data.companyName,
            companyDescription: data.companyDescription,
          };
      },
    });
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open('New password and confirmation do not match.', 'Close', {
        duration: 4000,
        panelClass: ['snackbar-error']
      });
    return;
    }
    const result = this.profileService.changePassword(this.oldPassword, this.newPassword, localStorage.getItem('userId')!);
    result.subscribe({
      next: () => {
        this.snackBar.open('Password changed successfully', 'Close', {
          duration: 4000,
        });
        this.oldPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        console.error('Error changing password:', err);
        this.snackBar.open('Failed to change password. Please try again..', 'Close', {
          duration: 4000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

deactivateAccount() {
  const dialogRef = this.dialog.open(DeleteDialogComponent, {
    data: {
      entityName: 'account'
    }
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      this.profileService.deactivateAccount(Number(localStorage.getItem('userId'))).subscribe({
        next: () => {
          this.snackBar.open('Account deactivated successfully', 'Close', {
            duration: 4000,
          });
        },
        error: (err) => {
          console.error('Error deactivating account:', err);
          this.snackBar.open('Failed to deactivate account. Please try again.', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        }
      });
    }
  });
}

  updateEventTypes() {
    this.profileService.updateEventTypes(this.selectedEventTypes);
  }
}
