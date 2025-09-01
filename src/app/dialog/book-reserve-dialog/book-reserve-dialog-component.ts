import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceProduct } from '../../model/service-product/service-product';
import { BudgetService } from '../../services/budget.service';
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatSelect, MatSelectChange } from "@angular/material/select";
import { MatOptionModule } from "@angular/material/core";
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Budget } from '../../model/budget/budget';
import { EventService } from '../../services/event.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ServiceProductCategory } from '../../model/service-product/service-product-category';



@Component({
  selector: 'app-book-reserve-dialog',
  standalone: true,
  imports: [CommonModule, MatFormField, MatLabel, MatSelect, MatOptionModule, MatError, ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './book-reserve-dialog-component.html',
  styleUrl: './book-reserve-dialog-component.css'
})

export class BookReserveDialogComponent {
  readonly data = inject<{ sp: ServiceProduct }>(MAT_DIALOG_DATA);
  readonly eventService = inject(EventService);
  readonly budgetService = inject(BudgetService);
  readonly router = inject(Router);
  readonly dialogRef = inject(MatDialogRef);

  spData: ServiceProduct = this.data.sp;
  selectedBudget = new FormControl('', Validators.required);
  budgets: Budget[] = [];

  selectedEvent = new FormControl(-1, Validators.required);
  events: any[] = [];
  index: number = -1; // index of selected event
  totalPrice: number = 0;

  ngOnInit() {
    this.eventService.getAllMine({ page: 0, size: 50 }).subscribe(response => {
      this.events = response.content; 
    });
    if (this.spData.discount && this.spData.price)
      this.totalPrice = this.spData.price - this.spData.discount;
  }

  onEventSelected(event: MatSelectChange) {
    this.index = event.value;
    this.budgets = this.events[this.index].budgets.filter(
        (b: { serviceProductCategory: ServiceProductCategory | undefined; }) => b.serviceProductCategory?.id === this.spData.category?.id);
    this.selectedEvent.setValue(this.index);
  }

  goToBudget() {
    const event = this.events[this.index];
    if (event) {
      this.router.navigate(['/budget'], { queryParams: { id: event.id, eventTypeId: event.type.id} });
      this.dialogRef.close();
    }
  }
}
