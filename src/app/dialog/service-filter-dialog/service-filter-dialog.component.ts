import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatCheckbox } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { EventTypeService } from '../../services/event-type.service';
import { ServiceProductCategory } from '../../model/service-product-category';
import { EventType } from '../../model/event-type';

@Component({
  selector: 'app-service-filter-dialog',
  standalone: true,
  imports: [MatDialogContent, MatCheckbox, ReactiveFormsModule, CommonModule],
  templateUrl: './service-filter-dialog.component.html',
  styleUrl: './service-filter-dialog.component.css'
})
export class ServiceFilterDialogComponent {
  categories: ServiceProductCategory[] = [];
  eventTypes: EventType[] = [];

  // Form controls
  minPrice = new FormControl();
  maxPrice = new FormControl();
  available = new FormControl(false);
  selectedCategory = new FormControl();
  selectedEventTypes = new FormControl([]);

  constructor(
    private dialogRef: MatDialogRef<ServiceFilterDialogComponent>,
    private categoryService: ServiceProductCategoryService,
    private eventTypesService: EventTypeService
  ) {}

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((data) => {
      this.categories = data.map(c => c);
    });

    this.eventTypesService.getAll().subscribe((data) => {
      this.eventTypes = data.map(e => e);
    });
  }

  close() {
    this.dialogRef.close();
  }

  filter() {
    console.log('Filtering with:', {
      category: this.selectedCategory.value,
      eventTypes: this.selectedEventTypes.value,
      minPrice: this.minPrice.value,
      maxPrice: this.maxPrice.value,
      available: this.available.value,
    });
    this.dialogRef.close({
      category: Number(this.selectedCategory.value),
      eventTypes: this.selectedEventTypes.value,
      minPrice: Number(this.minPrice.value || 0),
      maxPrice: Number(this.maxPrice.value || 0),
      available: this.available.value
    });
  }
}
