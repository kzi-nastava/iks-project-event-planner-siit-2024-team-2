import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Service } from '../../model/service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { EventTypeService } from '../../services/event-type.service';
import { EventType } from '../../model/event-type';
import { ServiceCategoryService } from '../../services/service-category.service';
import { ServiceCategory } from '../../model/service-category';
import { ProductService } from '../../services/product.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Product } from '../../model/product';
import { take } from 'rxjs';



@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [
    FormsModule, 
    CommonModule, 
    MatSelectModule, 
    ReactiveFormsModule,
  ],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css'
})
export class NewProductComponent {
  productCategories: ServiceCategory[] = [
    { id: 1, name: "Music" },
    { id: 2, name: "Catering" },
    { id: 3, name: "Waiter product" }
  ];
  selectedCategoryId: number = this.productCategories[0].id;
  id: number = -1;
  eventTypes: EventType[] = [];
  selectedEvents: number[] = [];
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private eventTypeService: EventTypeService, 
    private serviceCategoryService: ServiceCategoryService,
    private productService: ProductService,    
    private snackBar: MatSnackBar,
  ) {}

  loadEventTypes(): void {
    this.eventTypeService.getAll().subscribe(
      (eventTypes) => {
        this.eventTypes = eventTypes;
      }
      ,
      (error) => {
        console.error('Error fetching event types:', error);
      }
    );
  }

  loadServiceCategories(): void {
    this.serviceCategoryService.getAll().subscribe(
      (categories) => {
        this.productCategories = categories;
      }
      ,
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const productId = params['id'];
      if (productId) {
        this.fetchProductData(productId);
        this.id = Number(productId);
      }
      else {
        this.loadEventTypes();
        this.loadServiceCategories();
        this.id = -1;
        this.createProductForm.reset();
      }
    });
  }

  fetchProductData(productId: number): void {
    this.productService.getProduct(productId).subscribe(
      (product: any) => {
        this.createProductForm.patchValue({
          name: product.name,
          description: product.description,
          specifies: product.specifies,
          price: product.price,
          discount: product.discount,
          productCategory: product.categoryId,
          available: product.available,
          visible: product.visible
        });
        this.selectedEvents = product.eventTypes.map((event: any) => event.id) || []; 
        this.selectedCategoryId = product.serviceProductCategoryDto.id || -1;
        this.createProductForm.get('productCategory')?.setValue(this.selectedCategoryId);
      },
      (error) => {
        console.error('Error fetching product data:', error);
        this.snackBar.open('Failed to load product data.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    );
    this.eventTypeService.getAll().subscribe(
      (eventTypes) => {
        this.eventTypes = eventTypes;
      },
      (error) => {
        console.error('Error fetching event types:', error);
      }
    );

    this.serviceCategoryService.getAll().subscribe(
      (categories) => {
        this.productCategories = categories;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  createProductForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(5)]),
    specifies: new FormControl(''),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    discount: new FormControl(0, [Validators.min(0)]),
    productCategory: new FormControl(0, [Validators.required]),
    available: new FormControl(false),
    visible: new FormControl(false)
  });

  createProduct(): void {
    if (this.createProductForm.invalid) {
      this.createProductForm.markAllAsTouched();
      console.warn('Form is invalid:', this.createProductForm.errors);
      this.snackBar.open('Please fill out all required fields correctly.', 'Close', {
        duration: 4000,
        panelClass: ['snackbar-error']
      });
      return; 
    }
    const product: Product = {
      name: this.createProductForm.value.name ?? '',
      description: this.createProductForm.value.description ?? '',
      specifies: this.createProductForm.value.specifies ?? '',
      price: this.createProductForm.value.price ?? 0,
      discount: this.createProductForm.value.discount ?? 0,
      availableEventTypesIds: this.selectedEvents,
      categoryId: Number(this.createProductForm.value.productCategory), 
      available: this.createProductForm.value.available ?? false,
      visible: this.createProductForm.value.visible ?? false,
      serviceProductProviderId: Number(localStorage.getItem('userId')),
    };
    if (this.id !== -1) { // Indicates an update
      this.productService.update(product, this.id).subscribe({
        next: (event: any) => {
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err: any) => {
          console.error('Failed to update product:', err);
        }
      });
    } else {
      this.productService.add(product).subscribe({
        next: (event: any) => {
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err: any) => {
          console.error('Failed to create product:', err);
        }
      });
    }
    this.snackBar.open('Product saved successfully!', 'Close', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onEventCheckboxChange(event: any, eventTypeId: number) {
    if (this.selectedEvents.includes(eventTypeId)) {
      this.selectedEvents = this.selectedEvents.filter(id => id !== eventTypeId);
    } else {
      this.selectedEvents.push(eventTypeId);
    }
  }


  // backToAllServicesPerhaps(): void {
  //   if (this.service.id != -1) {
  //     this.router.navigate(['/my-products'], {
  //       queryParams: { id: this.service.id }
  //     });
  //   }
  // }
}
