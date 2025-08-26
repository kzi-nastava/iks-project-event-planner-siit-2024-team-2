import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(private snackBar: MatSnackBar) {}

  show(message: string, duration = 2000, dismissible = false) {
    let config: MatSnackBarConfig = {
      duration: duration,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snackbar']
    };

    this.snackBar.open(message, dismissible ? 'Close' : '', config);
  }
}
