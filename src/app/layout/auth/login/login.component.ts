import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth/auth-service.service'; // Adjust path as needed
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { SuspendedDialogComponent, SuspendedDialogData } from '../../../dialog/suspended-dialog/suspended-dialog.component';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
  ],
})
export class LoginComponent {
  loginForm: FormGroup;

  // Injected
  readonly fb = inject(FormBuilder);
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly snackBar = inject(MatSnackBar);
  readonly dialog = inject(MatDialog);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.route.queryParams.subscribe(params => {
          if (params['returnUrl']) {
            this.router.navigateByUrl(params['returnUrl']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        });
        this.snackBar.open('Login successful.', 'Close', {
          duration: 4000,
        });
      },
      error: (err) => {
        console.error('Login failed:', err);
        if (err?.error?.suspendedAt) {
          const data: SuspendedDialogData = {suspendedAt: new Date(err.error.suspendedAt)};
          this.dialog.open(SuspendedDialogComponent, {data: data});
        } else {
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        }
      }
    });
    
  }
}
