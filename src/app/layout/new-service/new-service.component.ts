import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';


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
}

