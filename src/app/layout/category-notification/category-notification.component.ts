import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { ServiceService } from '../../services/service.service';
import { ServiceProductCategory } from '../../model/service-product-category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardContent, MatCard } from "@angular/material/card";
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../services/communication/notification.service';


@Component({
  selector: 'app-category-notification',
  standalone: true,
  imports: [CommonModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatCardContent, MatButtonModule],
  templateUrl: './category-notification.component.html',
  styleUrl: './category-notification.component.css'
})
export class CategoryNotificationComponent {

  constructor(private spCategoryService: ServiceProductCategoryService,
              private serviceService: ServiceService,
              private snackBar: MatSnackBar,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotificationService) {}

  @Input() message!: string | null;
  @Input() seen!: boolean | null;
  @Input() notificationId!: number | null;


  category = {name: '', description: ''};
  service: any;
  selectedCategory = '';
  categories: string[] = [];
  categoryName: string = '';
  categoryDescription: string = '';
  isAccepted = false;

  ngOnInit(): void {
    const messageObj = JSON.parse(String(this.message));
    this.service = messageObj.service;
    this.categoryName = messageObj.categoryName;
    this.categoryDescription = messageObj.categoryDescription;
    this.category.name = this.categoryName;
    this.category.description = this.categoryDescription;
    this.message = 'Name: ' + this.categoryName + ',  Description: ' + this.categoryDescription;

    this.spCategoryService.getAll().subscribe(allCategories => {
      this.categories = allCategories.map(c => c.name);
    });

    this.route.queryParams.subscribe(params => {
      if (params['callAccept'] === 'true') {
        this.category.name = params['name'];
        this.category.description = params['description'];
        this.onAccept();
      }
    });
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

    if (this.notificationId)
      this.notificationService.seen([this.notificationId]).subscribe({
      next: () => console.log('Seen'),
      error: err => console.error(err)
    });
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