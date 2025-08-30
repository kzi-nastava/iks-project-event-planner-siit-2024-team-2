import { CommonModule, Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component'; 
import { UserRole } from '../../services/dtos/user/user-role';
import { ImageService } from '../../services/image.service';
import { ToastService } from '../../services/utils/toast-service';
import { UserInfo } from 'node:os';
import { environment } from '../../../environments/environment';
import { User } from '../../services/dtos/user/user';
import { AuthService } from '../../services/auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userRole: UserRole = 'EVENT_ORGANIZER' 
  selectedFile: File | null = null;
  profilePreview: string | ArrayBuffer | null = null;
  imageName: string = '';

  userInfo = { firstName: '', lastName: '', email: '', image: '', address: '', phoneNumber: '' };
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
  showAllProfileData: boolean = true;

  constructor(private route: ActivatedRoute, private location: Location) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      var userId;
      if (params['id']) {
        userId = params['id'];
        this.showAllProfileData = false;
      }
      else {
        userId = localStorage.getItem('userId');
        this.showAllProfileData = true;
      }

      if (userId) {
        this.loadUserData(userId);
      }
    });
  }

  readonly profileService = inject(ProfileService);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly toastService = inject(ToastService);
  readonly imageService = inject(ImageService);


  loadUserData(userId?: number) {
    if (!userId) {
      console.error('User ID not found in local storage.');
      return;
    } else {
      this.profileService.getUserData(Number(userId)).subscribe({
        next: (data) => {
          this.userRole = data.userRole;
          this.userInfo = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            image: data.image,
            phoneNumber: data.phoneNumber,
            address: data.address
          };
          this.userInfo.image = environment.apiHost + "api/images/" + data.imageEncodedName;
          this.favoriteEvents = data.favoriteEvents;
          this.favoriteServices = data.favoriteServices;
          this.upcomingEvents = data.upcomingEvents;

          if (data.userRole === 'SERVICE_PRODUCT_PROVIDER') {
            this.profileService.getCompanyData(Number(userId)).subscribe({
              next: (companyData) => {
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
            image: data.image,
            phoneNumber: data.phoneNumber,
            address: data.address,
          };
      },
    });
  }

  updateCompanyInfo() {
    if (this.userRole !== 'SERVICE_PRODUCT_PROVIDER') return;
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
      id: Number(localStorage.getItem('userId')),
      entityName: 'account'
    }
  });

  dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    if (confirmed) {
      this.profileService.delete(Number(localStorage.getItem('userId'))).subscribe({
        next: () => {
          this.snackBar.open('Account deactivated successfully', 'Close', {
            duration: 4000,
          });
          this.authService.logout();
          this.router.navigate(['/home']);
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

  goBack() {
    this.location.back();
  }
  
  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.profilePreview = reader.result as string;
        this.selectedFile = file;
        this.imageName = file.name;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadProfilePicture() {
    if (!this.selectedFile) return;
    const userId = localStorage.getItem('userId');
    if (!userId) return; 
      this.imageService.uploadImage(this.selectedFile).subscribe({
        next: res => {
          this.imageName = atob(res);
          this.profileService.uploadProfilePicture(this.imageName, Number(userId)).subscribe({
          next: (data) => {
            this.toastService.show('Profile picture updated successfully', 3000);
          },
          error: (err) => {
            console.error('Error uploading profile picture:', err);
            this.toastService.show('Failed to upload profile picture: ' + err.message, 3000);
          }
        });
        },
        error: err => {
          this.toastService.show('Failed to upload image: ' + err.message, 3000);
        }
      });
  }

  removeProfilePicture() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.profileService.removeProfilePicture(Number(userId)).subscribe({
      next: () => {
        this.toastService.show('Profile picture removed', 3000);
        this.userInfo.image = '';
        this.profilePreview = null;
      },
      error: (err) => {
        console.error('Error removing profile picture:', err);
        this.toastService.show('Failed to remove profile picture: ' + err.message, 3000);
      }
    });
  }
}
