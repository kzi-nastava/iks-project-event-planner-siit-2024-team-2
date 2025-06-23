import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userRole: 'OD' | 'PUP' | 'AK' | 'A' = 'OD';

  userInfo = { firstName: '', lastName: '', email: '', profilePicture: '', address: '', phoneNumber: '' };
  companyInfo = { name: '', description: '' };
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  favoriteEvents: any[] = [];
  favoriteServices: any[] = [];
  upcomingEvents: any[] = [];
  serviceCategories: any[] = [];
  eventTypes: any[] = [];
  selectedEventTypes: any[] = [];

  constructor(private profileService: ProfileService, private snackBar: MatSnackBar,) {
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

          if (data.userRole === 'PUP') {
            this.companyInfo = data.companyInfo;
            this.serviceCategories = data.serviceCategories;
            this.eventTypes = data.eventTypes;
            this.selectedEventTypes = data.selectedEventTypes;
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
    if (this.userRole !== 'PUP') return;
    console.log('Updating company info:', this.companyInfo);
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
    if (confirm('Are you sure you want to deactivate your account?')) {
      this.profileService.deactivateAccount();
    }
  }

  updateEventTypes() {
    this.profileService.updateEventTypes(this.selectedEventTypes);
  }
}
