import { Component } from '@angular/core';
import { FormGroup, FormsModule, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Service } from '../../model/service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MapComponent } from '../../shared/map/map.component';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
      FormsModule,
      CommonModule,
      MatSelectModule,
      MapComponent,
      ReactiveFormsModule,
    ],
  providers: [MapComponent],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {

  createEventForm = new FormGroup({
    name: new FormControl(),
    description: new FormControl(),
    date: new FormControl(),
    latitude: new FormControl(),
    longitude: new FormControl(),
    eventType: new FormControl(),
    maxAttendances: new FormControl(),
    isOpen: new FormControl()
  });
  

  createEvent(): void {
    const event = {
      name: this.createEventForm.value.name,
      description: this.createEventForm.value.description,
      longitude: this.createEventForm.value.longitude,
      latitude: this.createEventForm.value.latitude,
      date: this.createEventForm.value.date,
      eventType: this.createEventForm.value.eventType,
      maxAttendances: this.createEventForm.value.maxAttendances,
      isOpen: this.createEventForm.value.isOpen
    };
    console.log(event);}

  eventTypes: string[] = ["Wedding", "Festival", "Party"];
  selectedType: string = this.eventTypes[0]; // Default selection
  // eventTypes: string[] = ['Wedding', 'Funeral', 'Birthday', 'Conference'];
  // selectedEvents: { [key: string]: boolean } = {};

  constructor(private route: ActivatedRoute, private router: Router) {
    // Initialize selectedEvents with default values
    this.eventTypes.forEach((event) => {
      //this.selectedEvents[event] = false;
    });
  }

  // name: string,
  // description: string,
  // date: Date,
  // latitude: number,
  // longitude: number,
  // eventType: number,
  // maxAttandances: number,
  // isOpen: boolean
  // binding to the service data, on which the user clicked
  service: Service = new Service();
  event: { name?: string; description?: string; location?: string; date?: string; time?: string; eventType?: string } = {}

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
      //this.selectedEvents[event] = true;
    });
  }

  backToAllServicesPerhaps(): void {
    if (this.service.id != -1) {
      this.router.navigate(['/my-services']);
    }
  }
  

}

