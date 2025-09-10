import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Router, RouterModule } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth-service.service';
import { Subject, takeUntil } from 'rxjs';
import { ImageService } from '../../../services/image.service';
import { ToastService } from '../../../services/utils/toast-service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatCheckboxModule,
    MatRadioModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule
  ]
})
export class RegisterComponent implements OnInit, OnDestroy {
  registerForm!: FormGroup;
  isEventOrganizer = false;
  upgrading = false;

  destroy$ = new Subject<void>();

  // Injected
  readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly imageService = inject(ImageService);
  readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      userType: ['serviceProvider', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]{10,15}$') 
        ]
      ],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      companyName: [''],
      companyDescription: [''],
      profilePicture: [null],
    }, {
      validators: this.passwordMatchValidator
    });

    this.toggleFormFields();

    this.authService.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(status => {
      this.upgrading = status && this.authService.getUserRole() === 'AUTHENTICATED'
      if (this.upgrading) {
        this.registerForm.get('email')?.setValue(this.authService.getUserEmail());
        this.registerForm.get('email')?.updateValueAndValidity();
      }
    });
  }

  imagePreview = "";
  selectedImage?: File;
  imageName = "";
  
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
    this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.selectedImage = file;
        this.imageName = file.name;
      };
      reader.readAsDataURL(file);
    }
  }

  passwordMatchValidator(group: FormGroup): { mismatch: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onUserTypeChange(): void {
    this.toggleFormFields();
  }

  toggleFormFields(): void {
    this.isEventOrganizer = this.registerForm.get('userType')?.value === 'eventOrganizer';

    if (this.isEventOrganizer) {
      this.registerForm.get('firstName')?.setValidators([Validators.required]);
      this.registerForm.get('lastName')?.setValidators([Validators.required]);
      this.registerForm.get('companyName')?.clearValidators();
      this.registerForm.get('companyDescription')?.clearValidators();
    } else {
      this.registerForm.get('companyName')?.setValidators([Validators.required]);
      this.registerForm.get('companyDescription')?.setValidators([Validators.required]);
    }

    this.registerForm.get('firstName')?.updateValueAndValidity();
    this.registerForm.get('lastName')?.updateValueAndValidity();
    this.registerForm.get('companyName')?.updateValueAndValidity();
    this.registerForm.get('companyDescription')?.updateValueAndValidity();
  }

onRegister(): void {
  if (!this.registerForm.valid) {
    return;
  }

  const doRegister = (imageName?: string) => {
    if (this.isEventOrganizer) {
      this.authService.register(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.address,
        this.registerForm.value.phone,
        this.isEventOrganizer ? 2 : 3,
        imageName
      ).subscribe({
        next: (response) => {
          if (response) {
            console.log('Registration successful');
            this.router.navigate(['/signin']);
          } else {
            console.error('Registration failed');
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
        }
      });
    } else {
      this.authService.registerCompany(
        this.registerForm.value.email,
        this.registerForm.value.password,
        this.registerForm.value.firstName,
        this.registerForm.value.lastName,
        this.registerForm.value.companyName,
        this.registerForm.value.companyDescription,
        this.registerForm.value.address,
        this.registerForm.value.phone,
        this.isEventOrganizer ? 2 : 3,
        imageName
      ).subscribe({
        next: (response) => {
          if (response) {
            console.log('Registration successful');
            this.router.navigate(['/signin']);
          } else {
            console.error('Registration failed');
          }
        },
        error: (error) => {
          console.error('Registration error:', error);
        }
      });
    }
  };

  if (this.selectedImage) {
    this.imageService.uploadImage(this.selectedImage).subscribe({
      next: (response) => {
        this.imageName = atob(response);
        doRegister(this.imageName);
        this.toastService.show('Profile picture uploaded successfully', 3000);
      },
      error: (err) => {
        this.toastService.show('Failed to upload profile picture: ' + err.message, 3000);
        doRegister();
      }
    });
  } else {
    doRegister();
  }
}


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
