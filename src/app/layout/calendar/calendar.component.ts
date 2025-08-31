import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarService, EventDto, BookingDto } from '../../services/user/calendar.service';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  attendingEvents: EventDto[] = [];
  organizerEvents: EventDto[] = [];
  providerBookings: BookingDto[] = [];
  authService = inject(AuthService);
  role = this.authService.getUserRole();
  userId = 1;

  constructor() {}
  calendarService = inject(CalendarService);
  ngOnInit(): void {
    
    this.userId = Number(localStorage.getItem('userId'));
    this.calendarService.getAttendingEvents(this.userId).subscribe(events => {
      this.attendingEvents = events;
    });
    if (this.role === 'EVENT_ORGANIZER') {
      this.calendarService.getOrganizerEvents(this.userId).subscribe(events => {
        this.organizerEvents = events;
      });
    }

    if (this.role === 'SERVICE_PRODUCT_PROVIDER') {
      this.calendarService.getProviderBookings(this.userId).subscribe(bookings => {
        this.providerBookings = bookings;
      });
    }
  }
}
