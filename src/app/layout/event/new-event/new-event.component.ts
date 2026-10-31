import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormsModule, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MapComponent } from '../../../shared/map/map.component';
import { EventType } from '../../../model/event/event-type';
import { EventTypeService } from '../../../services/event/event-type.service';
import { EventService } from '../../../services/event/event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { InvitationsDialogComponent } from '../../../dialog/invitations-dialog/invitations-dialog.component';
import { InvitationItem } from '../../../dialog/invitations-dialog/invitations-dialog.component';
import { ToastService } from '../../../services/utils/toast-service';
import { EventDto } from '../../../dto/event/event.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { Event } from '../../../model/event/event'
import { validationSuffix } from '../../../utils/error-utils';

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
export class NewEventComponent implements OnInit {
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
  invitations: InvitationItem[] = [];

  eventTypes: EventType[] = [];
  selectedType = this.eventTypes[0]; 

  // Injected
  readonly dialog = inject(MatDialog);
  readonly toastService = inject(ToastService);
  readonly eventService = inject(EventService);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly eventTypeService = inject(EventTypeService);
  readonly snackBar = inject(MatSnackBar);

  isOpen = () => this.createEventForm?.value?.open;

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
    const open = this.createEventForm.value.open;
    const event: EventDto = {
      name: this.createEventForm.value.name || null,
      description: this.createEventForm.value.description || null,
      longitude: this.createEventForm.value.longitude || null,
      latitude: this.createEventForm.value.latitude || null,
      date: this.createEventForm.value.date || null,
      eventTypeId: this.createEventForm.value.eventType || null,
      eventOrganizerId: Number(localStorage.getItem('userId')),
      maxAttendances: this.createEventForm.value.maxAttendances || null,
      open: open,
      invitationEmails: open ? null : this.invitations.map(invitation => invitation.email),
      activityIds: null,
      budgetIds: null
    };
    if (this.id !== -1) { // Indicates an update
      this.eventService.update(event, this.id).subscribe({
        next: () => {
          this.router.navigate(['../'], { relativeTo: this.route });
          this.toastService.show('Event updated successfully', 2000, true);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to update event:', err);
          this.toastService.show('Failed to update event' + validationSuffix(err), 6000, true);
        }
      });
      return;
    }
    this.eventService.add(event).subscribe({
      next: () => {
        this.router.navigate(['../'], { relativeTo: this.route });
        this.toastService.show('Event added successfully', 2000, true);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to create event:', err);
          this.toastService.show('Failed to create event' + validationSuffix(err), 6000, true);
      }
    });
  }

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
          (event: Event) => {
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
            this.invitations = event.invitationEmails?.map((email: string) => ({ email: email, editable: false })) || [];
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
      error: (err: HttpErrorResponse) => {
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

  // Invitations
  openInvitationsDialog() {
    const dialogRef = this.dialog.open(InvitationsDialogComponent, {
      data: [...this.invitations],
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.invitations = result;
      }
    });
  }
}

