import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { ServiceProduct } from '../../model/service-product/service-product';
import { BudgetService } from '../../services/order/budget.service';
import { MatFormField, MatLabel, MatError } from "@angular/material/form-field";
import { MatSelect, MatSelectChange } from "@angular/material/select";
import { MatOptionModule, MatOptionSelectionChange, provideNativeDateAdapter } from "@angular/material/core";
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { Budget } from '../../model/budget/budget';
import { EventService } from '../../services/event/event.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { ToastService } from '../../services/utils/toast-service';
import { PurchaseDto } from '../../dto/budget/purchase.dto';
import { BookingDto } from '../../dto/budget/booking.dto';
import { Event } from '../../model/event/event';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepicker, MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from '@angular/material/input';
import { NgxMatTimepickerComponent } from "ngx-mat-timepicker";
import { NgxMatTimepickerDirective } from 'ngx-mat-timepicker';
import { DateRangeDto } from '../../dto/utils/date-range.dto';
import { ServiceService } from '../../services/service-product/service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Service } from '../../model/service-product/service';
import { addMilliseconds, differenceInMilliseconds, endOfDay, isBefore, max, min, parse, startOfDay } from 'date-fns';
import { validationSuffix } from '../../utils/error-utils';

@Component({
  selector: 'app-book-purchase-dialog',
  standalone: true,
  imports: [CommonModule, MatFormField, MatLabel, MatSelect, MatOptionModule, MatError, ReactiveFormsModule, MatInputModule,
    MatButtonModule, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogModule, MatStepperModule, MatDatepicker, 
    MatDatepickerModule, NgxMatTimepickerComponent, NgxMatTimepickerDirective],
  templateUrl: './book-purchase-dialog-component.html',
  styleUrl: './book-purchase-dialog-component.css',
  providers: [provideNativeDateAdapter()]
})

export class BookPurchaseDialogComponent implements OnInit {
  readonly data = inject<{ sp: ServiceProduct }>(MAT_DIALOG_DATA);
  readonly eventService = inject(EventService);
  readonly budgetService = inject(BudgetService);
  readonly router = inject(Router);
  readonly dialogRef = inject(MatDialogRef);
  readonly toastService = inject(ToastService);
  readonly serviceService = inject(ServiceService);

  spData: ServiceProduct = this.data.sp;
  selectedBudget = new FormControl(-1, Validators.required);
  budgets: Budget[] = [];

  selectedEvent = new FormControl(-1, Validators.required);
  events: Event[] = [];
  lastSelectedEventIndex = -1;
  index = -1; // index of selected event
  totalPrice = 0;
  selectedDate = new FormControl(new Date(), [Validators.required]);
  selectedDuration = new FormControl(0, [Validators.required]);
  duration: number | null = null;
  selectedTimeWindow = new FormControl({value: 0, disabled: true}, [Validators.required]);
  timeWindow: DateRangeDto | null = null;
  availableDates: DateRangeDto[] = [];
  selectedTime = new FormControl({value: "", disabled: true}, [Validators.required]);
  timeWindowForSelectedDate: DateRangeDto[] = [];
  
  isProduct = () => this.spData.dtype === 'Product';
  hasFixedDuration = () => {
    return !this.isProduct() && !!(this.spData as Service).duration;
  }
  isAutomaticReservation = (): string => (this.spData as Service).automaticReserved ? 'Yes' : 'No'

  ngOnInit() {
    this.eventService.getAllMine({ page: 0, size: -1 }).subscribe(response => {
      this.events = response.content; 
    });
    if (this.spData.price && this.spData.discount)
      this.totalPrice = this.spData.price - this.spData.discount;
    else if (this.spData.price)
      this.totalPrice = this.spData.price;
    if (!this.isProduct()) {
      const service = this.spData as Service;
      this.duration = service.duration;
      if (!this.duration || this.duration === 0) {
        this.selectedDuration.addValidators([Validators.min(service.minEngagementDuration || 0), Validators.max(service.maxEngagementDuration || 24)]);
        this.selectedDuration.updateValueAndValidity();
      }
    }
    this.selectedDate.valueChanges.subscribe(() => this.onDateSelected());
  }

  onEventSelected(event: MatSelectChange) {
    this.index = event.value;
    this.budgets = this.events[this.index].budgets.filter(
        b => b.serviceProductCategory?.id === this.spData.category?.id);
    this.selectedEvent.setValue(this.index);
  }

  onBudgetSelected() {
    if (this.isProduct())
      return
    if (this.selectedEvent.value !== null && this.selectedEvent.value !== this.lastSelectedEventIndex) {
      this.lastSelectedEventIndex = this.selectedEvent.value;
      this.serviceService.getAvailability(this.spData.id, this.events[this.selectedEvent.value].id).subscribe({
        next: (dates: DateRangeDto[]) => {
          this.availableDates = dates;
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to get availability:', err);
          this.toastService.show('Service not available', 2000);
        }
      })

    }
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
            this.budgetService.addNewPurchase(Number(this.selectedBudget.value), newPurchase).subscribe({
              next: () => {
                this.toastService.show('Purchase added successfully', 2000);
              },
              error: (err) => {
                console.error('Failed to add purchase:', err);
                this.toastService.show('Failed to purchase' + validationSuffix(err), 6000);
              }
            });
          }
          else {
            if (!this.selectedDate.value || !this.selectedTime.value || !this.duration)
              return;
            const dateTime = parse(this.selectedTime.value, 'HH:mm', this.selectedDate.value);
            const newBooking: BookingDto = {
              serviceId: this.spData.id,
              duration: this.duration || 0,
              date: dateTime.toISOString(),
              price: this.totalPrice
            };
            this.budgetService.addNewBooking(Number(this.selectedBudget.value), newBooking).subscribe({
              next: () => {
                if ((this.spData as Service).automaticReserved)
                  this.toastService.show('Booking added successfully', 2000);
                else
                  this.toastService.show('Booking request sent successfully', 2000);
              },
              error: (err) => {
                console.error('Failed to add booking:', err);
                if (validationSuffix(err))
                  this.toastService.show("Failed to book" + validationSuffix(err), 6000);
                else if (err.status >= 400 && err.status < 500 && err.status != 404)
                  this.toastService.show(err.error.message, 2000);
                else
                  this.toastService.show('Failed to book', 2000);
              }
            });
          }
          this.dialogRef.close(true);
        }
      })
    }
  }

  canConfirm() {
    if (!this.selectedBudget.value || this.selectedBudget.value === -1)
      return false;
    if (this.isProduct())
      return true;

    if (!this.selectedDate.value || !this.selectedTime.value || !this.duration)
      return false;
    if (this.selectedDate.invalid || this.selectedTime.invalid || this.selectedDuration.invalid)
      return false;
    return true;
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onDurationChanged() {
    this.duration = this.selectedDuration.value;
    this.timeWindowForSelectedDate = this.getTimeWindows();
  }

  onDateSelected() {
    if (!this.selectedDate.value) {
      this.timeWindow = null;
      this.selectedTimeWindow.reset();
      this.selectedTimeWindow.disable();
      this.selectedTime.reset();
      this.selectedTime.disable();
      this.timeWindowForSelectedDate = [];
      return;
    } 
    this.selectedTimeWindow.enable();
    this.timeWindow = null;
    this.selectedTime.reset();
    this.selectedTime.disable();
    this.timeWindowForSelectedDate = this.getTimeWindows();
  }

  getEventName() {
    if (this.index < 0) return "Not selected";
    return this.events[this.index].name;
  }

  getDurationLabel() {
    if (this.isProduct())
      return '';
    const service = this.spData as Service;
    return "Duration [" + (service.minEngagementDuration || 0) + "h - " + (service.maxEngagementDuration || 0) + "h]";
  }

  getMaxTime(timeWindowEndMs: number | null | undefined, duration: number | null) {
    if (!timeWindowEndMs || !duration)
      return null;
    return timeWindowEndMs - duration * 60 * 60 * 1000
  } 

  getTimeEnd(time: string | null, duration: number): number | null {
    if (!time)
      return null;
    const timeNum = parse(time || '00:00', 'HH:mm', new Date());
    return timeNum.getTime() + duration * 60 * 60 * 1000
  } 

  adjustEnd(endString: string | null): string {
    if (!endString)
      return "24:00";
    if (endString === "00:00")
      return "24:00";
    else
      return endString;
  }

  dateFilter = (d: Date | null): boolean => {
    if (d == null) return false;
    const dayStart = startOfDay(d).getTime();
    const dayEnd = endOfDay(d).getTime();
    return this.availableDates.some(date => date.start <= dayEnd && date.end >= dayStart);
  };

  getTimeWindows() : DateRangeDto[] {
    if (!this.selectedDate.value) return [];
    if (!this.duration) return [];
    const windows: DateRangeDto[] = [];
    const dayStart: Date = startOfDay(this.selectedDate.value);
    const dayEnd: Date = addMilliseconds(endOfDay(this.selectedDate.value), 1);
    for (const dateRange of this.availableDates) {
      const start: Date = max([new Date(dateRange.start), dayStart]);
      const end: Date = min([new Date(dateRange.end), dayEnd]);
      if (isBefore(start, end) && differenceInMilliseconds(end, start) >= this.duration * 60 * 60 * 1000) {
        windows.push({start: start.getTime(), end: end.getTime()});
      }
    }
    return windows;
  }

  
  onTimeWindowSelected(e: MatOptionSelectionChange, selectedRange: DateRangeDto) {
    if (e.source.selected && e.isUserInput) {
      this.timeWindow = selectedRange;
      this.selectedTime.reset();
      this.selectedTime.enable();
    }
  }
}
