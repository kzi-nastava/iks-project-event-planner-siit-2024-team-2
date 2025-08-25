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
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [
      FormsModule,
      CommonModule,
      MatSelectModule,
      MapComponent,
      ReactiveFormsModule,
      MatButtonModule,
      MatTooltipModule 
    ],
  providers: [MapComponent],
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.css'
})
export class NewEventComponent {

  id = -1;
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

  eventTypes: EventType[] = [];

  createEvent(): void {
    if (!localStorage.getItem('userId')) {
      console.error('User is not logged in. Cannot create event.');
      this.router.navigate(['/login']);
      return;
    }
    if (this.createEventForm.invalid) {
      this.createEventForm.markAllAsTouched();
      this.snackBar.open('Please fill out all required fields correctly.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
      return;
    }
    const event = {
      name: this.createEventForm.value.name,
      description: this.createEventForm.value.description,
      longitude: this.createEventForm.value.longitude,
      latitude: this.createEventForm.value.latitude,
      date: this.createEventForm.value.date,
      eventTypeId: this.createEventForm.value.eventType,
      eventOrganizer: Number(localStorage.getItem('userId')),
      maxAttendances: this.createEventForm.value.maxAttendances,
      open: this.createEventForm.value.open,
      budgets: []
    };
    if (this.id !== -1) { // Indicates an update
      this.eventService.update(event, this.id).subscribe({
        next: (event: any) => {
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err: any) => {
          console.error('Failed to update event:', err);
        }
      });
      return;
    }
    this.eventService.add(event).subscribe({
      next: (event: any) => {
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error: (err: any) => {
        console.error('Failed to create event:', err);
      }
    });
  }

  selectedType = this.eventTypes[0]; 
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private eventTypeService: EventTypeService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const eventId = params['id'];
      if (eventId) {
        this.fetchEventData(eventId);
        this.id = Number(eventId);
      }
    });
    this.loadEventTypes();
  }

fetchEventData(eventId: number): void {
  this.eventTypeService.getAll().subscribe(
    (eventTypes) => {
      this.eventTypes = eventTypes;

      this.eventService.getEvent(eventId).subscribe(
        (event: any) => {
          console.log('Fetched event:', event);
          const formattedDate = new Date(event.date).toLocaleDateString('en-CA');
          this.createEventForm.patchValue({
            name: event.name,
            description: event.description,
            date: formattedDate,
            latitude: event.latitude,
            longitude: event.longitude,
            eventType: event.type.id,
            maxAttendances: event.maxAttendances,
            open: event.open
          });
          this.selectedType =
            this.eventTypes.find((type) => type.id === event.type.id) ||
            this.eventTypes[0];
        },
        (error) => {
          console.error('Error fetching event:', error);
          this.snackBar.open('Failed to load event.', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
        }
      );
    },
    (error) => {
      console.error('Error fetching event types:', error);
    }
  );
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

  openAgenda() {
    this.router.navigate(['/agenda'], { queryParams: { id: this.id } });
  }
}

