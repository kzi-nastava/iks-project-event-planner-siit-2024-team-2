import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Service } from '../../model/service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-service',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSelectModule],
  templateUrl: './new-service.component.html',
  styleUrl: './new-service.component.css'
})
export class NewServiceComponent {
  serviceCategories: string[] = ["Music", "Catering", "Waiter service"];
  selectedCategory: string = this.serviceCategories[0]; // Default selection

  eventTypes: string[] = ['Wedding', 'Funeral', 'Birthday', 'Conference'];
  selectedEvents: { [key: string]: boolean } = {};

  constructor(private route: ActivatedRoute, private router: Router) {
    // Initialize selectedEvents with default values
    this.eventTypes.forEach((event) => {
      this.selectedEvents[event] = false;
    });
  }

  // binding to the service data, on which the user clicked
  service: Service = new Service();

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
    // UPDATE THIS LATER - IMPLEMENT getServiceById(serviceId)
    // this.service = this.serviceService.getServiceById(serviceId);

    // For demonstration purposes, we use a mock service:
    this.service = new Service(serviceId, 'Catering', 'Peric catering', 'We offer catering for lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum.',
       'No specifies', 7, 1, ['catering.jpg'], ['Wedding', 'Birthday'], 1, 7, 3, true, true, true);

    this.service.eventTypes.forEach((event) => {
      this.selectedEvents[event] = true;
    });
  }

  backToAllServicesPerhaps(): void {
    if (this.service.id != -1) {
      this.router.navigate(['/my-services']);
    }
  }
  

}

