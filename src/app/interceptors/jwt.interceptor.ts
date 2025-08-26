import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, filter } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const token = authService.getToken();

  const exclude = ['/api/invitations/?/accept', '/api/auth/quick-login'];
  const isExcluded = exclude.some(url => url.split('?').every(part => req.url.includes(part)));

  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError(err => {
      if (err.status === 401 && !isExcluded) {
        authService.logout();

        router.navigate(['/signin']);

        snackBar.open('Your session has expired. Please sign in again.', 'Close', {
          duration: 5000,
        });
      }

      return throwError(() => err);
    })
  );;
};
