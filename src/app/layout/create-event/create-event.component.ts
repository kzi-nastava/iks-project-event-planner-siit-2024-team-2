import { Component } from '@angular/core';
import { FormGroup, FormsModule, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MapComponent } from '../../shared/map/map.component';
import { EventType } from '../../model/event-type';
import { EventTypeService } from '../../services/event-type.service';
import { EventService } from '../../services/event.service';

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
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', [Validators.required, Validators.minLength(1)]),
    date: new FormControl('', [Validators.required]),
    latitude: new FormControl(0, [Validators.required]),
    longitude: new FormControl(0, [Validators.required]),
    eventType: new FormControl(0, [Validators.required]),
    maxAttendances: new FormControl(0, [Validators.required]),
    open: new FormControl()
  });
  
  eventTypes = [
    { id: 1, name: "Wedding" },
    { id: 2, name: "Festival" },
    { id: 3, name: "Party" },
  ];
  
  createEvent(): void {
    const event = {
      name: this.createEventForm.value.name,
      description: this.createEventForm.value.description,
      longitude: this.createEventForm.value.longitude,
      latitude: this.createEventForm.value.latitude,
      date: this.createEventForm.value.date,
      eventType: this.createEventForm.value.eventType,
      maxAttendances: this.createEventForm.value.maxAttendances,
      open: this.createEventForm.value.open
    };
    this.eventService.add(event).subscribe({
      next: (event: any) => {
        console.log('Event created:', event);
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err: any) => {
        console.error('Failed to create event:', err);
      }
    });
  }

  selectedType = this.eventTypes[0]; 
  constructor(private route: ActivatedRoute, private router: Router, private eventService: EventService, private eventTypeService: EventTypeService) { }

  ngOnInit(): void {
    this.loadEventTypes();
  }
  loadEventTypes(): void {
    this.eventTypeService.getAll().subscribe({
      next: (types: EventType[]) => {
        this.eventTypes = types;
      },
      error: (err: any) => {
        console.error('Failed to load event types:', err);
      }
    });
  }

  onCoordinatesSelected(coordinates: { lat: number; lng: number }): void {
    this.createEventForm.patchValue({
      latitude: coordinates.lat,
      longitude: coordinates.lng,
    });
  }
  
  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}

