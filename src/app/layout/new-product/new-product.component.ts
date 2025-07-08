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

  eventTypes: EventType[] = [{name: 'Wedding', id: 1}, {name: 'Funeral', id: 2}, {name: 'Birthday', id: 3}, {name: 'Conference', id: 4}];
  selectedEvents: number[] = [];
  
  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private eventTypeService: EventTypeService, 
    private serviceCategoryService: ServiceCategoryService,
    private productService: ProductService,    
    private snackBar: MatSnackBar,
  ) {
    // Initialize selectedEvents with default values
  }

  // binding to the service data, on which the user clicked
  service: Service = new Service();
  loadEventTypes(): void {
    // Fetch event types from the service
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
    // Fetch categories from the service
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
    this.loadEventTypes();
    this.loadServiceCategories();
  }

  createProductForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(5)]),
    specifies: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required, Validators.min(0)]),
    discount: new FormControl(0, [Validators.min(0)]),
    productCategory: new FormControl(null, [Validators.required]),
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
    const product = {
      name: this.createProductForm.value.name,
      description: this.createProductForm.value.description,
      specifies: this.createProductForm.value.specifies,
      price: this.createProductForm.value.price,
      discount: this.createProductForm.value.discount,
      availableEventTypesIds: this.selectedEvents,
      categoryId: Number(this.createProductForm.value.productCategory), 
      available: this.createProductForm.value.available,
      visible: this.createProductForm.value.visible,
      serviceProductProviderId: Number(localStorage.getItem('userId')),
    };
    // this.productService.add(product).subscribe({
    //   next: (event: any) => {
    //     console.log('Event created:', event);
    //     this.router.navigate(['../'], { relativeTo: this.route });
    //   },
    //   error: (err: any) => {
    //     console.error('Failed to create event:', err);
    //   }
    // });
    console.log(product);
    this.snackBar.open('Product created successfully!', 'Close', {
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


  backToAllServicesPerhaps(): void {
    if (this.service.id != -1) {
      this.router.navigate(['/my-products'], {
        queryParams: { id: this.service.id }
      });
    }
  }
}

