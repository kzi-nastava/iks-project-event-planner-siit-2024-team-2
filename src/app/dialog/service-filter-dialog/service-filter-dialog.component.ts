import { Component } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-service-filter-dialog',
  standalone: true,
  imports: [MatDialogContent, MatCheckbox, ReactiveFormsModule, CommonModule],
  templateUrl: './service-filter-dialog.component.html',
  styleUrl: './service-filter-dialog.component.css'
})
export class ServiceFilterDialogComponent {
  constructor(private dialogRef: MatDialogRef<ServiceFilterDialogComponent>) { }
  close() {
    this.dialogRef.close();
  }

  categories = ['Music', 'Catering', 'Waiter service'];
  selectedCategories = new FormControl([]);

  eventTypes: string[] = ['Wedding', 'Funeral', 'Birthday', 'Conference'];
  selectedEventTypes = new FormControl([]);
}
