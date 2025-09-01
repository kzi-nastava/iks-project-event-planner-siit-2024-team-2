import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component'; 
import { UserRole } from '../../services/dtos/user/user-role';
import { ImageService } from '../../services/image.service';
import { ToastService } from '../../services/utils/toast-service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceProductCategory } from '../../model/service-product/service-product-category';
import { EventType } from '../../model/event/event-type';
import { Event as EP_Event } from '../../model/event/event';
import { UserService } from '../../services/user/user.service';
import { EventSummaryDto } from '../../services/dtos/event/event-summary.dto';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { ServiceProductSummaryDto } from '../../services/dtos/service-product/service-product-summary.dto';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';
import { ImgFallbackDirective } from '../../utils/image-fallback';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon, MatSidenavModule, MatCardModule, MatButtonModule, CommonModule, MatInputModule, MatIconModule, MatTabsModule,
      MatDialogModule, MatPaginatorModule, MatProgressSpinnerModule, DragScrollComponent, DragScrollItemDirective,
      MatMenuModule, ReactiveFormsModule, ImgFallbackDirective],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userRole: UserRole = 'EVENT_ORGANIZER' 
  selectedFile: File | null = null;
  profilePreview: string | ArrayBuffer | null = null;
  imageName = '';

  userInfo = { firstName: '', lastName: '', email: '', image: '', address: '', phoneNumber: '' };
  companyInfo = { companyName: '', companyDescription: '' };
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  favoriteEvents: EventSummaryDto[] = [];
  favoriteServiceProducts: ServiceProductSummaryDto[] = [];
  upcomingEvents: EP_Event[] = [];
  serviceCategories: ServiceProductCategory[] = [];
  eventTypes: EventType[] = [];
  selectedEventTypes: EventType[] = [];
  showAllProfileData = true;
  attendingEvents: number[] = [];

  // Injected
  readonly route = inject(ActivatedRoute);
  readonly location = inject(Location);

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      let userId;
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
    this.loadAttendingEvents();
  }

  readonly profileService = inject(ProfileService);
  readonly dialog = inject(MatDialog);
  readonly snackBar = inject(MatSnackBar);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly toastService = inject(ToastService);
  readonly imageService = inject(ImageService);
  readonly userService = inject(UserService);
  readonly eventService = inject(EventService);


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
          this.loadFavoriteEvents(Number(userId));
          this.loadFavoriteServiceProducts(Number(userId));
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
    // TODO: endpoint doesn't exist
    // this.profileService.updateEventTypes(this.selectedEventTypes);
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
          next: () => {
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

  loadFavoriteEvents(userId: number) {
    this.userService.getFavoriteEvents(userId).subscribe({
      next: (events) => {
        this.favoriteEvents = events;
        this.convertProfilePictureUrls(this.favoriteEvents);
      },
      error: (err) => {
        console.error('Error loading favorite events:', err);
      }
    });
  }

  removeEventFromFavorites(eventId: number) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.userService.removeFavoriteEvent(Number(userId), eventId).subscribe({
      next: () => {
        this.favoriteEvents = this.favoriteEvents.filter(ev => ev.id !== eventId);
        this.toastService.show('Removed from favorites 💔', 2500);
      },
      error: (err) => {
        console.error('Failed to remove favorite:', err);
        this.toastService.show('Could not remove favorite', 2500);
      }
    });
  }

  loadFavoriteServiceProducts(userId: number) {
    this.userService.getFavoriteServiceProducts(userId).subscribe({
      next: (serviceProducts) => {
        this.favoriteServiceProducts = serviceProducts;
        this.convertImageUrls(this.favoriteServiceProducts);
        this.convertProfilePictureUrls(this.favoriteServiceProducts);
      },
      error: (err) => {
        console.error('Error loading favorite service products:', err);
      }
    });
  }

  removeServiceProductFromFavorites(serviceProductId: number) {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.userService.removeFavoriteServiceProduct(Number(userId), serviceProductId).subscribe({
      next: () => {
        this.favoriteServiceProducts = this.favoriteServiceProducts.filter(sp => sp.id !== serviceProductId);
        this.toastService.show('Removed from favorites 💔', 2500);
      },
      error: (err) => {
        console.error('Failed to remove favorite:', err);
        this.toastService.show('Could not remove favorite', 2500);
      }
    });
  }

  navigateToEventDetails(eventId?: number): void {
    this.router.navigate(['/event-details'], { queryParams: { id: eventId } });
  }

  navigateToSpDetails(spId?: number): void {
    this.router.navigate(['/sp-details'], { queryParams: { id: spId } });
  }

  convertImageUrls(array: ServiceProductSummaryDto[]) {
    array.forEach(element => {
      if (element.image != null)
        element.image = environment.apiHost + "api/images/" + element.image;
    });
  }

  convertProfilePictureUrls(array: EventSummaryDto[] | ServiceProductSummaryDto[]) {
    array.forEach(element => {
      if (element.creatorProfilePicture != null)
        element.creatorProfilePicture = environment.apiHost + "api/images/" + element.creatorProfilePicture;
    });
  }

    loadAttendingEvents(): void {
    this.eventService.getAttendingEventsIds().subscribe({
      next: (eventIds) => {
        this.attendingEvents = eventIds;
      },
      error: (err) => {
        console.error('Failed to load attending events:', err);
      }
    });
  }

  attendEvent(eventId: number) {
    this.eventService.attendEvent(eventId).subscribe({
      next: () => {
        this.loadAttendingEvents();
        this.toastService.show('Successfully joined the event', 2000);
      },
      error: (err) => {
        console.error('Failed to join event:', err);
        this.toastService.show('Failed to join event', 2000);
      }
    });
  }

  cancelAttendance(eventId: number) {
    this.eventService.cancelAttendance(eventId).subscribe({
      next: () => {
        this.loadAttendingEvents();
        this.toastService.show('Successfully left the event', 2000);
      },
      error: (err) => {
        console.error('Failed to leave event:', err);
        this.toastService.show('Failed to leave event', 2000);
      }
    });
  }

  isUserAttending(eventId: number): boolean {
    return this.attendingEvents.includes(eventId);
  }
}
