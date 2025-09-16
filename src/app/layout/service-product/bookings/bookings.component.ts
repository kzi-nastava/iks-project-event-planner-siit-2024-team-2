import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { intlFormatDistance } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import { PagedModel } from '../../../shared/model/paged-model';
import { ToastService } from '../../../services/utils/toast-service';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';
import { PendingBookingDto } from '../../../dto/budget/pending-booking.dto';
import { BookingService } from '../../../services/order/booking.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatPaginator, NgIf, MatButtonModule, DatePipe],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css',
  animations: [
    trigger('fadeOut', [
      transition(':leave', [
        style({
          opacity: 1,
          height: '*',
        }),
        animate('300ms ease-out', style({
          opacity: 0,
          height: '0px',
        }))
      ])
    ])
  ]
})
export class BookingsComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  bookings: PendingBookingDto[] = [];
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;

  // Injected
  readonly bookingService = inject(BookingService);
  readonly toastService = inject(ToastService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.fetchBookings();
  }

  fetchBookings() {
    this.bookingService.mine({ page: this.pageIndex, size: this.pageSize })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PagedModel<PendingBookingDto>) => {
          this.bookings = JSON.parse(JSON.stringify(response.content));
          this.totalElements = response.page.totalElements;
        },
        error: () => {
          this.toastService.show('Failed to load bookings');
        }
      });
  }

  decline(booking: PendingBookingDto) {
    booking.hiding = true;
    setTimeout(() => { // Allow animation to start
      booking.hidden = true;
    }, 0);
    this.totalElements--;
    this.bookingService.delete(booking.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          booking.hidden = false;
          booking.hiding = false;
          this.toastService.show('Failed to decline booking');
        }
      });
  }

  accept(booking: PendingBookingDto) {
    booking.hiding = true;
    setTimeout(() => { // Allow animation to start
      booking.hidden = true;
    }, 0);
    this.totalElements--;
    this.bookingService.accept(booking.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          booking.hidden = false;
          booking.hiding = false;
          this.toastService.show('Failed to accept booking');
        }
      })
  }

  formatDate(date: Date) {
    return intlFormatDistance(date, Date.now(), {locale: 'en-US'});
  }

  getBooker(booking: PendingBookingDto) {
    if (!booking.bookerName && !booking.bookerEmail)
      return 'Deleted User';
    return (booking.bookerName ? `${booking.bookerName} (${booking.bookerEmail})` : booking.bookerEmail);
  }

  isEllipsisActive(element: HTMLElement): boolean {
    return element.offsetHeight < element.scrollHeight;
  }

  readMore(element: HTMLElement): void {
    element.classList.remove('collapsed');
    element.classList.add('expanded');
  }

  readLess(element: HTMLElement): void {
    element.classList.remove('expanded');
    element.classList.add('collapsed');
  }

  getTargetUrl(booking: PendingBookingDto) {
    return this.router.createUrlTree(['/sp-details'], 
      { queryParams: { id: booking.service.id } }).toString();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    if (this.pageSize != event.pageSize)
      if (this.totalElements > this.pageIndex * event.pageSize) // enough elements for another page
        this.pageSize = event.pageSize;
    this.fetchBookings();
  }

  adjustEnd(endString: string | null): string {
    if (!endString)
      return "--:--";
    if (endString === "00:00")
      return "24:00";
    else
      return endString;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

