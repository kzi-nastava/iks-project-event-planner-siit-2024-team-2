import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RouterModule } from '@angular/router';
import {MatRadioModule} from '@angular/material/radio';
import { CommonModule } from '@angular/common';

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
export class RegisterComponent {
  registerForm!: FormGroup;
  isEventOrganizer = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      userType: ['eventOrganizer'],
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
      contactName: [''],
      companyDescription: ['']
    }, {
      validators: this.passwordMatchValidator
    });

    this.toggleFormFields();
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
      this.registerForm.get('contactName')?.clearValidators();
      this.registerForm.get('companyDescription')?.clearValidators();
    } else {
      this.registerForm.get('companyName')?.setValidators([Validators.required]);
      this.registerForm.get('contactName')?.setValidators([Validators.required]);
      this.registerForm.get('companyDescription')?.setValidators([Validators.required]);
      this.registerForm.get('firstName')?.clearValidators();
      this.registerForm.get('lastName')?.clearValidators();
    }

    this.registerForm.get('firstName')?.updateValueAndValidity();
    this.registerForm.get('lastName')?.updateValueAndValidity();
    this.registerForm.get('companyName')?.updateValueAndValidity();
    this.registerForm.get('contactName')?.updateValueAndValidity();
    this.registerForm.get('companyDescription')?.updateValueAndValidity();
  }

  onRegister(): void {
    if (this.registerForm.valid) {
      console.log('Form Submitted', this.registerForm.value);
    }
  }
}
