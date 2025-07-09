import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Service } from '../../model/service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ServiceService } from '../../services/service.service';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';


@Component({
  selector: 'app-new-service',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSelectModule],
  templateUrl: './new-service.component.html',
  styleUrl: './new-service.component.css'
})
export class NewServiceComponent {
  serviceCategories : string[] = [];
  eventTypes: string[] = ['Wedding', 'Funeral', 'Birthday', 'Conference'];
  selectedEvents: { [key: string]: boolean } = {};
  
  // binding to the service data, on which the user clicked
  service: Service = new Service();
  
  constructor(private route: ActivatedRoute, private router: Router, private serviceService: ServiceService,
    private SPCategoryService: ServiceProductCategoryService) {
    // Initialize selectedEvents with default values
    this.eventTypes.forEach((event) => {
      this.selectedEvents[event] = false;
    });
  }

  ngOnInit(): void {
    // Get the service ID from query parameters
    this.route.queryParams.subscribe(params => {
      const serviceId = params['id'];
      if (serviceId) {
        this.fetchServiceData(serviceId); // Fetch the data based on the ID
      }
    });
  }

  fetchServiceData(serviceId: number): void {
    this.serviceService.getService(serviceId).subscribe(service => {
      this.service = service;
      console.log(this.service);
    });
    this.SPCategoryService.getAll().subscribe(categories => {
      this.serviceCategories = categories.map(c => c.name);
    });

    // this.service.eventTypes.forEach((event) => {
    //   this.selectedEvents[event] = true;
    // });
  }

  backToAllServicesPerhaps(): void {
    if (this.service.id != -1) {
      this.router.navigate(['/my-services']);
    }
  }
}

