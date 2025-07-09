import { Component } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ServiceProductCategory } from '../../model/service-product-category';
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
  categories: any[] = [];
  eventTypes: any[] = [];

  constructor(private dialogRef: MatDialogRef<ServiceFilterDialogComponent>,
    private categoryService: ServiceProductCategoryService, private eventTypesService: EventTypeService) { }
  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe((data) => {
      this.categories = data.map(c => c.name);
    });

    this.eventTypesService.getAll().subscribe((data) => {
      this.eventTypes = data.map(e => e.name);
    })
  }
  
  selectedCategories = new FormControl([]);
  selectedEventTypes = new FormControl([]);
}
