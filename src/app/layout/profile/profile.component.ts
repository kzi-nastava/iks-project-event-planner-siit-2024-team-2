import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  // User type identification
  userType: 'OD' | 'PUP' | 'AK' | 'A' = 'OD'; // This would come from auth service in real app
  
  // Personal information
  userInfo = {
    firstName: '',
    lastName: '',
    email: '',
    profilePicture: '',
    phone: ''
  };

  // Company information (for PUP)
  companyInfo = {
    name: '',
    description: '',
    location: '',
    phone: '',
    photos: [] as string[]
  };

  // Password change
  oldPassword = '';
  newPassword = '';
  confirmPassword = '';

  // Favorites
  favoriteEvents: any[] = [];
  favoriteServices: any[] = [];

  // Calendar/schedule
  upcomingEvents: any[] = [];

  // Service categories (for PUP)
  serviceCategories: any[] = [];
  eventTypes: any[] = [];
  selectedEventTypes: any[] = [];

  constructor() {
    // In a real app, you would fetch this data from a service
    this.loadUserData();
  }

  loadUserData() {
    // Mock data - in real app this would come from API
    this.userInfo = {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      profilePicture: 'assets/default-profile.jpg',
      phone: '+1234567890'
    };

    if (this.userType === 'PUP') {
      this.companyInfo = {
        name: 'Example Company',
        description: 'We provide excellent services',
        location: '123 Main St, City',
        phone: '+1234567890',
        photos: ['assets/company1.jpg', 'assets/company2.jpg']
      };
      this.serviceCategories = ['Catering', 'Decoration', 'Music'];
      this.eventTypes = ['Wedding', 'Birthday', 'Corporate'];
      this.selectedEventTypes = ['Wedding', 'Birthday'];
    }

    this.favoriteEvents = [{ id: 1, name: 'Summer Party' }];
    this.favoriteServices = [{ id: 1, name: 'Wedding Catering' }];
    this.upcomingEvents = [{ id: 1, title: 'Client Meeting', date: new Date() }];
  }

  updatePersonalInfo() {
    console.log('Updating personal info:', this.userInfo);
    // API call would go here
  }

  updateCompanyInfo() {
    if (this.userType !== 'PUP') return;
    console.log('Updating company info:', this.companyInfo);
    // API call would go here
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    console.log('Changing password');
    // API call would go here
  }

  deactivateAccount() {
    if (confirm('Are you sure you want to deactivate your account?')) {
      console.log('Deactivating account');
      // API call would go here
    }
  }

  updateEventTypes() {
    console.log('Selected event types:', this.selectedEventTypes);
    // API call would go here
  }
}