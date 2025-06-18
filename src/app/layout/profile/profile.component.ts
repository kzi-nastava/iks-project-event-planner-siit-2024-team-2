import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileService } from '../../services/profile.service'; 

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  userType: 'OD' | 'PUP' | 'AK' | 'A' = 'OD';

  userInfo = { firstName: '', lastName: '', email: '', profilePicture: '', phone: '' };
  companyInfo = { name: '', description: '', location: '', phone: '', photos: [] as string[] };
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';
  favoriteEvents: any[] = [];
  favoriteServices: any[] = [];
  upcomingEvents: any[] = [];
  serviceCategories: any[] = [];
  eventTypes: any[] = [];
  selectedEventTypes: any[] = [];

  constructor(private profileService: ProfileService) {
    this.loadUserData();
  }

  loadUserData() {
    this.profileService.getUserData(1).subscribe({
      next: (data) => {
        console.log('User data loaded:', data);
        this.userInfo = {
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          profilePicture: data.profilePicture,
          phone: data.phoneNumber
        };
        console.log('User info:', this.userInfo);
        this.favoriteEvents = data.favoriteEvents;
        this.favoriteServices = data.favoriteServices;
        this.upcomingEvents = data.upcomingEvents;

        if (data.userType === 'PUP') {
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

  updatePersonalInfo() {
    this.profileService.updatePersonalInfo(this.userInfo);
  }

  updateCompanyInfo() {
    if (this.userType !== 'PUP') return;
    console.log('Updating company info:', this.companyInfo);
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }
    const result = this.profileService.changePassword(this.oldPassword, this.newPassword);
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
