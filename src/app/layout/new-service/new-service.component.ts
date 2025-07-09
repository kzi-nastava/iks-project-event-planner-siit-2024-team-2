import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Service } from '../../model/service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { EventTypeService } from '../../services/event-type.service';
import { forkJoin } from 'rxjs';


@Component({
  selector: 'app-new-service',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSelectModule],
  templateUrl: './new-service.component.html',
  styleUrl: './new-service.component.css'
})
export class NewServiceComponent {
  serviceCategories : string[] = [];
  eventTypes: string[] = [];
  selectedEvents: { [key: string]: boolean } = {};  // default all false
  
  // binding to the service data, on which the user clicked
  service: Service = new Service();

  constructor(private route: ActivatedRoute, private router: Router, private serviceService: ServiceService,
    private SPCategoryService: ServiceProductCategoryService, private eventTypeService: EventTypeService) {
    // Initialize selectedEvents with default values
    eventTypeService.getAll().subscribe(allTypes => {
      this.eventTypes = allTypes.map(t => t.name);
    })
  }

  ngOnInit(): void {
    // Get the service ID from query parameters
    this.route.queryParams.subscribe(params => {
      const serviceId = params['id'];
      if (serviceId) {
        this.fetchServiceData(serviceId); // Fetch the data based on the ID
      } 
      else // in case of creating new service
      {   // RELOAD THE PAGE and get categories
        this.SPCategoryService.getAll().subscribe(allCategories => {
          this.serviceCategories = allCategories.map(c => c.name);
        })
        this.service = new Service();
        this.eventTypes.forEach((event) => {
          this.selectedEvents[event] = false;
        });
      }
    });
  }

  fetchServiceData(serviceId: number): void {

    forkJoin({
      service: this.serviceService.getService(serviceId),
      categories: this.SPCategoryService.getAll()
    }).subscribe(({ service, categories }) => {
      this.service = service;
      this.serviceCategories = categories.map(c => c.name);

      // waits for service and serviceCategories assigning
      this.service.availableEventTypes.forEach((event) => {
        this.selectedEvents[event.name] = true;
      });
    });
  }

  backToAllServicesPerhaps(): void {
    if (this.service.id != -1) {
      this.router.navigate(['/my-services']);
    }
  }
}