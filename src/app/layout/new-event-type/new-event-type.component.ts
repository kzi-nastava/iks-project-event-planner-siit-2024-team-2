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
import { EventType } from '../../model/event-type';
import { CreateEventType } from '../../model/create-event-type';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';


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
    private snackBar: MatSnackBar
  ) {}
  services = [
    { id: 1, name: 'Catering' },
    { id: 2, name: 'Photography' },
    { id: 3, name: 'Music' },
    { id: 4, name: 'Decoration' },
  ];
  inputForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1)]),
    recommendedServices: new FormControl([], Validators.required),
  });
  onSubmit() {
    if (this.inputForm.valid) {
      console.log('Form Submitted:', this.inputForm.value);
  
      const eventType: CreateEventType = {
        name: this.inputForm.value.name,
        recommendedServiceProducts: this.inputForm.value.recommendedServices,
      };
  
      this.eventTypeService.add(eventType).subscribe({
        next: (eventType: any) => {
          console.log('Event Type created:', eventType);
  
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
  

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
