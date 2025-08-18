import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { ServiceService } from '../../services/service.service';
import { ServiceProductCategory } from '../../model/service-product-category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';


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
              private snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute) {}

  message = '{"service":{"categoryId":-1,"images":["39d99e61-5323-4eb7-a58c-7126f887df81.jpeg"],"name":"m","description":"m","specifies":"m","price":4,"discount":0,"availableEventTypeIds":[4],"serviceProductProviderId":10,"duration":5,"minEngagementDuration":0,"maxEngagementDuration":0,"visible":true,"available":null,"automaticReserved":true,"reservationDaysDeadline":5,"cancellationDaysDeadline":5},"categoryName":"food","categoryDescription":"food"}';
  isCategoryRequest = this.message.includes('"categoryId":-1');
  category = {name: '', description: ''};
  service: any;
  selectedCategory = '';
  categories: string[] = [];
  categoryName: string = '';
  categoryDescription: string = '';
  isAccepted = false;

  ngOnInit(): void {
    
    if (this.isCategoryRequest) {
      const messageObj = JSON.parse(this.message);
      this.service = messageObj.service;
      this.categoryName = messageObj.categoryName;
      this.categoryDescription = messageObj.categoryDescription;
      this.category.name = this.categoryName;
      this.category.description = this.categoryDescription;
      this.message = 'New category request:  name: ' + this.categoryName + ', description: ' + this.categoryDescription;

      this.spCategoryService.getAll().subscribe(allCategories => {
        this.categories = allCategories.map(c => c.name);
      });

      this.route.queryParams.subscribe(params => {
        if (params['callAccept'] === 'true') {
          this.categoryName = params['name'];
          this.categoryDescription = params['description'];
          this.onAccept();
        }
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
    this.isAccepted = true;
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

  onEdit() {
    this.router.navigate(['/new-category'], { 
      queryParams: { 
        id: 5,  // flag for edit of request category, not existing one
        name: this.categoryName, 
        description: this.categoryDescription 
      }
    }); 
  }
}
