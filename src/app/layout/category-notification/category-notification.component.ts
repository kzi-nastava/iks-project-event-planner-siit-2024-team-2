import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { ServiceService } from '../../services/service.service';
import { ServiceProductCategory } from '../../model/service-product/service-product-category';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardContent } from "@angular/material/card";
import { MatButtonModule } from '@angular/material/button';
import { NotificationService } from '../../services/communication/notification.service';
import { NotificationDto } from '../../services/dtos/communication/notification.dto';
import { CreateServiceDto } from '../../services/dtos/service-product/create-service.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { validationSuffix } from '../../utils/error-utils';


@Component({
  selector: 'app-category-notification',
  standalone: true,
  imports: [CommonModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatCardContent, MatButtonModule],
  templateUrl: './category-notification.component.html',
  styleUrl: './category-notification.component.css'
})
export class CategoryNotificationComponent implements OnInit {
  // Injected
  readonly spCategoryService = inject(ServiceProductCategoryService);
  readonly serviceService = inject(ServiceService);
  readonly snackBar = inject(MatSnackBar);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);
  readonly notificationService = inject(NotificationService);

  @Input() message!: string | null;
  @Input() seen!: boolean | null;
  @Input() notificationId!: number | null;


  category = {name: '', description: ''};
  serviceDto: CreateServiceDto | null = null;
  selectedCategory = '';
  categories: string[] = [];
  categoryName = '';
  categoryDescription = '';
  isAccepted = false;
  providerMessage = '';

  ngOnInit(): void {
    const messageObj = JSON.parse(String(this.message));
    this.serviceDto = messageObj.service;
    this.categoryName = messageObj.categoryName;
    this.categoryDescription = messageObj.categoryDescription;
    this.category.name = this.categoryName;
    this.category.description = this.categoryDescription;
    this.message = 'Name: ' + this.categoryName + ',  Description: ' + this.categoryDescription;
    this.providerMessage = 'Your service ' + this.serviceDto?.name + ' created successfully. You can find it in "My services".\n';

    this.spCategoryService.getAll().subscribe(allCategories => {
      this.categories = allCategories.map(c => c.name || '');
    });

    this.route.queryParams.subscribe(params => {
      if (params['callAccept'] === 'true') {
        this.category.name = params['name'];
        this.category.description = params['description'];
        this.providerMessage += 'Your category request for ' + this.categoryName + ' was accepted, but changed.';
        this.onAccept();
      }
    });
  }

  onAccept() {
    // chosen the existing category from the combo box
    if (this.selectedCategory != '') {
      this.spCategoryService.getByName(this.selectedCategory).subscribe(category => {
        this.serviceDto!.categoryId = category.id;
        this.createService();
      });
      this.providerMessage += 'Your category request for ' + this.categoryName + ' was denied. ' +
                              'Your service category was changed to ' + this.selectedCategory + '.';
    }

    // create new category, assign it to the service category and create service
    else {
      if (this.category.name == this.categoryName && this.category.description == this.categoryDescription)
        this.providerMessage += 'Your category request for ' + this.categoryName + ' was accepted.';

      this.spCategoryService.add(this.category).subscribe({
        next: (newCategory: ServiceProductCategory) => {
          this.serviceDto!.categoryId = newCategory.id;
          this.createService();
          this.snackBar.open('Category ' + this.category.name + ' created successfully!', 'Close', {duration: 3000, panelClass: ['snack-success']});
      },
        error: (err) => {
          console.error('Error creating category:', err);
          this.snackBar.open('Failed to create category'+ validationSuffix(err) +'. Please try again.', 'Close', {duration: 6000, panelClass: ['snack-error']});
        }
      });
    }
    this.isAccepted = true;
    this.MarkSeenNotification();
    this.sendNotificationToProvider();
  }

  private sendNotificationToProvider() {
    const notification: NotificationDto = {
      title: "Service created",
      message: this.providerMessage,
      dismissed: false,
      seen: false,
      userId: this.serviceDto?.serviceProductProviderId || -1
    };
    this.notificationService.add(notification).subscribe({
      next: () => {
        console.log('Provider notification created.');
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to create notification:', err);
      }
    });
  }

  private MarkSeenNotification() {
    if (this.notificationId)
      this.notificationService.seen([this.notificationId]).subscribe({
        next: () => console.log('Seen'),
        error: err => console.error(err)
      });
  }

  private createService() {
    if (!this.serviceDto) return;
    this.serviceService.add(this.serviceDto).subscribe({
      next: () => {
        this.snackBar.open('Service ' + this.serviceDto?.name + ' created successfully!', 'Close', { duration: 3000, panelClass: ['snack-success'] });
      },
      error: (err: HttpErrorResponse) => {
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