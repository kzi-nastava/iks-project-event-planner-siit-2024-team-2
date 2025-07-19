import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { EventTypeService } from '../../services/event-type.service';

@Component({
  selector: 'app-service-filter-dialog',
  standalone: true,
  imports: [MatDialogContent, MatCheckbox, ReactiveFormsModule, CommonModule],
  templateUrl: './service-filter-dialog.component.html',
  styleUrl: './service-filter-dialog.component.css'
})
export class ServiceFilterDialogComponent {
  categories: string[] = [];
  eventTypes: string[] = [];

  // Form controls
  minPrice = new FormControl();
  maxPrice = new FormControl();
  available = new FormControl(false);
  selectedCategories = new FormControl([]);
  selectedEventTypes = new FormControl([]);

  constructor(
    private dialogRef: MatDialogRef<ServiceFilterDialogComponent>,
    private categoryService: ServiceProductCategoryService,
    private eventTypesService: EventTypeService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((data) => {
      this.categories = data.map(c => c.name);
    });

    this.eventTypesService.getAll().subscribe((data) => {
      this.eventTypes = data.map(e => e.name);
    });
  }

  close() {
    this.dialogRef.close();
  }

  filter() {
    this.dialogRef.close({
      categories: this.selectedCategories.value,
      eventTypes: this.selectedEventTypes.value,
      minPrice: this.minPrice.value,
      maxPrice: this.maxPrice.value,
      available: this.available.value
    });
  }
}
