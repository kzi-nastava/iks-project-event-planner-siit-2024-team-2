import { Component, inject, OnInit } from '@angular/core';
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
import { ToastService } from '../../services/utils/toast-service';
import { PurchaseDto } from '../../services/dtos/budget/purchase.dto';
import { BookingDto } from '../../services/dtos/budget/booking.dto';
import { randomInt } from 'crypto';
import { PagedModel } from '../../shared/model/paged-model';
import { Event } from '../../model/event/event';



@Component({
  selector: 'app-book-reserve-dialog',
  standalone: true,
  imports: [CommonModule, MatFormField, MatLabel, MatSelect, MatOptionModule, MatError, ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './book-reserve-dialog-component.html',
  styleUrl: './book-reserve-dialog-component.css'
})

export class BookReserveDialogComponent implements OnInit {
  readonly data = inject<{ sp: ServiceProduct }>(MAT_DIALOG_DATA);
  readonly eventService = inject(EventService);
  readonly budgetService = inject(BudgetService);
  readonly router = inject(Router);
  readonly dialogRef = inject(MatDialogRef);
  readonly toastService = inject(ToastService);

  spData: ServiceProduct = this.data.sp;
  selectedBudget = new FormControl(-1, Validators.required);
  budgets: Budget[] = [];

  selectedEvent = new FormControl(-1, Validators.required);
  events: Event[] = [];
  index = -1; // index of selected event
  totalPrice = 0;

  ngOnInit() {
    this.eventService.getAllMine({ page: 0, size: 50 }).subscribe(response => {
      this.events = response.content; 
    });
    if (this.spData.price && this.spData.discount)
      this.totalPrice = this.spData.price - this.spData.discount;
    else if (this.spData.price)
      this.totalPrice = this.spData.price;
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

  confirmBookingPurchase() {
    if (this.selectedBudget.value && this.selectedBudget.value !== -1) {
      this.budgetService.getBudget(this.selectedBudget.value).subscribe(budget => {
        if (budget.currentSpent + this.totalPrice > budget.plannedSpending)
          this.toastService.show('Your budget is only ' + (budget.plannedSpending - budget.currentSpent) +
                                 ' €! Increase it.', 4000);
        
        else {
          if (this.spData.dtype === 'Product') {
            const newPurchase: PurchaseDto = {
              productId: this.spData.id,
              price: this.totalPrice
            };
            this.budgetService.addNewPurchase(Number(this.selectedBudget.value), newPurchase).subscribe();
            this.toastService.show('Purchase added successfully', 2000);
          }
          else {
            const newBooking: BookingDto = {
              serviceId: this.spData.id,
              duration: Math.floor(Number(this.spData.price) / 3),
              date: new Date().toISOString(),
              price: this.totalPrice
            };
            this.budgetService.addNewBooking(Number(this.selectedBudget.value), newBooking).subscribe();
            this.toastService.show('Booking added successfully', 2000);
          }
          this.dialogRef.close(true);
        }
      })
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}
