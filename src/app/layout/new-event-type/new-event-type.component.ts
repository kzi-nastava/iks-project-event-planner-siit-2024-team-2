import { Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { EventTypeService } from '../../services/event-type.service';
import { EventType } from '../../model/event/event-type';
import { CreateEventType } from '../../services/dtos/event/create-event-type';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ServiceService } from '../../services/service.service';


@Component({
  selector: 'app-material-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
  templateUrl: './new-event-type.component.html',
  styleUrl: './new-event-type.component.css'
})
export class NewEventTypeComponent {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventTypeService: EventTypeService,
    private snackBar: MatSnackBar,
    private serviceService: ServiceService
  ) {

  }
  services = [
    { id: 1, name: 'Catering' },
    { id: 2, name: 'Photography' },
    { id: 3, name: 'Music' },
    { id: 4, name: 'Decoration' },
  ];
  inputForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    description: new FormControl('', [Validators.required, Validators.minLength(1)]),
    recommendedServices: new FormControl([]),
  });
  loadServices() {
    this.serviceService.getAll().subscribe({
      next: (response: any) => {
        console.log('Services loaded:', response);
        this.services = (response || []).map((service: any) => ({
          id: service.id,
          name: service.name
        }));
        console.log('Mapped services:', this.services);
      },
      error: (err) => {
        console.error('Error loading services:', err);
        this.snackBar.open('Failed to load services. Please try again.', 'Close',
          {
            duration: 3000,
            panelClass: ['snack-error']
          });
      }
    });
  }

  id = -1;
  ngOnInit() {
      this.route.queryParams.subscribe(params => {
      const eventTypeId = params['id'];
      if (eventTypeId) {
        this.fetchEventTypeData(eventTypeId);
        this.id = Number(eventTypeId);
      }
    });
    this.loadServices();
  }
fetchEventTypeData(eventTypeId: number): void {
  this.eventTypeService.getEventType(eventTypeId).subscribe(
    (event: any) => {
      console.log('Fetched event:', event);
      
      const recommendedIds = (event.recommendedServiceProducts || []).map((s: any) => s.id);
      
      this.inputForm.patchValue({
        name: event.name,
        description: event.description,
        recommendedServices: recommendedIds
      });
    },
    (error) => {
      console.error('Error fetching event:', error);
      this.snackBar.open('Failed to load event.', 'Close', {
        duration: 3000,
        panelClass: ['snackbar-error'],
      });
    }
  );
}


onSubmit() {
  if (this.inputForm.valid) {
    console.log('Form Submitted:', this.inputForm.value);

    const eventType: CreateEventType = {
      name: this.inputForm.value.name!,
      description: this.inputForm.value.description!,
      recommendedServiceProducts: this.inputForm.value.recommendedServices || []
    };

    if (this.id !== -1) {
      // Update existing Event Type
      this.eventTypeService.update(this.id, eventType).subscribe({
        next: (updatedEventType: any) => {
          console.log('Event Type updated:', updatedEventType);

          this.snackBar.open('Event Type updated successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });

          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('Error updating event type:', err);
          this.snackBar.open('Failed to update Event Type. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    } else {
      // Create new Event Type
      this.eventTypeService.add(eventType).subscribe({
        next: (createdEventType: any) => {
          console.log('Event Type created:', createdEventType);

          this.snackBar.open('Event Type created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['snack-success']
          });

          this.router.navigate(['../'], { relativeTo: this.route });
        },
        error: (err) => {
          console.error('Error creating event type:', err);
          this.snackBar.open('Failed to create Event Type. Please try again.', 'Close', {
            duration: 3000,
            panelClass: ['snack-error']
          });
        }
      });
    }
  }
}

  

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
