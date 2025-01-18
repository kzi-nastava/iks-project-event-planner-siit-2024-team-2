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
  ],
  templateUrl: './new-event-type.component.html',
  styleUrl: './new-event-type.component.css'
})
export class NewEventTypeComponent {
  constructor(private route: ActivatedRoute, private router: Router) {}
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
    }
  }

  onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
