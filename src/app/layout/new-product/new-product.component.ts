import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Service } from '../../model/service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { EventTypeService } from '../../services/event-type.service';
import { EventType } from '../../model/event-type';
import { ServiceCategoryService } from '../../services/service-category.service';
import { ServiceCategory } from '../../model/service-category';



@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSelectModule],
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
  selectedEvents: { [key: number]: boolean } = {};

  constructor(
    private route: ActivatedRoute, 
    private router: Router, 
    private eventTypeService: EventTypeService, 
    private serviceCategoryService: ServiceCategoryService
  ) {
    // Initialize selectedEvents with default values
    this.eventTypes.forEach((event) => {
      this.selectedEvents[event.id] = false;
    });
  }

  // binding to the service data, on which the user clicked
  service: Service = new Service();
  loadEventTypes(): void {
    // Fetch event types from the service
    this.eventTypeService.getAll().subscribe(
      (eventTypes) => {
        console.log('Fetched event types:', eventTypes);
        this.eventTypes = eventTypes;
        // Initialize selectedEvents with the fetched event types
        this.eventTypes.forEach((event) => {
          this.selectedEvents[event.id] = false;
        });
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
        console.log('Fetched categories:', categories);
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
    // Get the service ID from query parameters
    this.route.queryParams.subscribe(params => {
      const serviceId = params['id'];
      if (serviceId) {
        this.fetchServiceData(serviceId); // Fetch the data based on the ID
      }
    });
  }

  fetchServiceData(serviceId: number): void {
    // UPDATE THIS LATER - IMPLEMENT getServiceById(serviceId)
    // this.service = this.serviceService.getServiceById(serviceId);

    // For demonstration purposes, we use a mock service:
    this.service = new Service(serviceId, 'Catering', 'Peric catering', 'We offer catering for lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum.',
       'No specifies', 7, 1, ['catering.jpg'], ['Wedding', 'Birthday'], 1, 7, 3, true, true, true);

    // this.service.eventTypes.forEach((event) => {
    //   this.selectedEvents[event] = true;
    // });
  }

  backToAllServicesPerhaps(): void {
    if (this.service.id != -1) {
      this.router.navigate(['/my-products'], {
        queryParams: { id: this.service.id }
      });
    }
  }
}

