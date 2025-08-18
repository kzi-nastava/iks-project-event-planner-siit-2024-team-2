import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { ServiceService } from '../../services/service.service';
import { ServiceProductCategory } from '../../model/service-product-category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent {
  constructor(private spCategoryService: ServiceProductCategoryService,
              private serviceService: ServiceService,
              private snackBar: MatSnackBar
  ) {}

  message = '{"service":{"categoryId":-1,"images":["39d99e61-5323-4eb7-a58c-7126f887df81.jpeg"],"name":"m","description":"m","specifies":"m","price":4,"discount":0,"availableEventTypeIds":[4],"serviceProductProviderId":10,"duration":5,"minEngagementDuration":0,"maxEngagementDuration":0,"visible":true,"available":null,"automaticReserved":true,"reservationDaysDeadline":5,"cancellationDaysDeadline":5},"categoryName":"food","categoryDescription":"food"}';
  isCategoryRequest = this.message.includes('"categoryId":-1');
  category = {name: '', description: ''};
  service: any;
  selectedCategory = '';
  categories: string[] = [];

  ngOnInit(): void {
    
    if (this.isCategoryRequest) {
      const messageObj = JSON.parse(this.message);
      this.service = messageObj.service;
      let categoryName = messageObj.categoryName;
      let categoryDescription = messageObj.categoryDescription;
      this.category.name = categoryName;
      this.category.description = categoryDescription;
      this.message = 'New category request:  name: ' + categoryName + ', description: ' + categoryDescription;

      this.spCategoryService.getAll().subscribe(allCategories => {
        this.categories = allCategories.map(c => c.name);
      });
    }
  }

  onAccept() {
    // chosen the existing category from the combo box
    if (this.selectedCategory != '') {
      this.spCategoryService.getByName(this.selectedCategory).subscribe(category => {
        this.service.categoryId = category.id;
        this.createService();
      });
    }

    // create new category, assign it to the service category and create service
    else {
      this.spCategoryService.add(this.category).subscribe({
        next: (newCategory: ServiceProductCategory) => {
          this.service.categoryId = newCategory.id;
          this.createService();
          this.snackBar.open('Category ' + this.category.name + ' created successfully!', 'Close', {duration: 3000, panelClass: ['snack-success']});
      },
        error: (err) => {
          console.error('Error creating category:', err);
          this.snackBar.open('Failed to create category. Please try again.', 'Close', {duration: 3000, panelClass: ['snack-error']});
        }
      });
    }
  }

  private createService() {
    this.serviceService.add(this.service).subscribe({
      next: () => {
        this.snackBar.open('Service ' + this.service.name + ' created successfully!', 'Close', { duration: 3000, panelClass: ['snack-success'] });
      },
      error: (err: any) => {
        console.error('Failed to create service:', err);
        this.snackBar.open('Failed to create category. Please try again.', 'Close', { duration: 3000, panelClass: ['snack-error'] });
      }
    });
  }
}
