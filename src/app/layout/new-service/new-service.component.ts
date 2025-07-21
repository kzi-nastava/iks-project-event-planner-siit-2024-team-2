import { Component } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
  imports: [FormsModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule],
  templateUrl: './new-service.component.html',
  styleUrl: './new-service.component.css'
})
export class NewServiceComponent {

  newServiceForm = new FormGroup({
      category: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      specifies: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      discount: new FormControl(0, [Validators.min(0)]),
      reservationDaysDeadline: new FormControl(0, [Validators.required, Validators.min(0)]),
      availableEventTypes: new FormArray([]),
      images: new FormControl('', [Validators.required]),
      visible: new FormControl(false),
      available: new FormControl(false),
      automaticReserved: new FormControl(false),
      durationForm: new FormGroup({
        duration: new FormControl(0, [Validators.min(0)]),
        minEngagementDuration: new FormControl(0, [Validators.min(0)]),
        maxEngagementDuration: new FormControl(0, [Validators.min(0)]),
      }, {validators: this.oneDurationRequiredValidator}),
      cancellationDaysDeadline: new FormControl(0, [Validators.required, Validators.min(0)]),
    });

  oneDurationRequiredValidator(group: AbstractControl): ValidationErrors | null {
    const duration = group.get('duration')?.value;
    const minEngagement = group.get('minEngagementDuration')?.value;
    const maxEngagement = group.get('maxEngagementDuration')?.value;

    return (duration > 0 || (minEngagement > 0 && maxEngagement > 0)) ? null : { oneDurationRequiredValidator: true };
  }
  serviceCategories : string[] = [];
  eventTypes: string[] = [];
  
  // binding to the service data, on which the user clicked
  service: Service = new Service();

  constructor(private route: ActivatedRoute, private router: Router, private serviceService: ServiceService,
    private SPCategoryService: ServiceProductCategoryService, private eventTypeService: EventTypeService) {
    
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
        // reset all checkboxes to false
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
      // this.service.availableEventTypes.forEach((type) => {
      //   this.availableEventTypes[type.name] = true;
      // });
    });
  }

  onCheckboxChange(event: any, eventType: string) {
    const selectedEvents = this.newServiceForm.get('availableEventTypes') as FormArray;
    if (event.target.checked) {
      selectedEvents.push(new FormControl(eventType));
    } else {
      const index = selectedEvents.controls.findIndex(ctrl => ctrl.value === eventType);
      if (index !== -1) {
        selectedEvents.removeAt(index);
      }
    }
  }

  onSubmit() {
    if (this.newServiceForm.valid) {
      console.log("The service created successfully.");
    }
  }

  backToAllServicesPerhaps(): void {
    if (this.service.id != -1) {
      this.router.navigate(['/my-services']);
    }
  }
}