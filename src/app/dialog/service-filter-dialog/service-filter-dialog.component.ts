import { Component } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-service-filter-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatCheckbox],
  templateUrl: './service-filter-dialog.component.html',
  styleUrl: './service-filter-dialog.component.css'
})
export class ServiceFilterDialogComponent {
  constructor(private dialogRef: MatDialogRef<ServiceFilterDialogComponent>) { }
  close() {
    this.dialogRef.close();
  }
}
