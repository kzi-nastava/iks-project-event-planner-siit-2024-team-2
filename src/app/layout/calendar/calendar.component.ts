import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService, EventDto, BookingDto } from '../../services/user/calendar.service';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
    calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay',
    },
    events: [],
    selectable: true,
    editable: false,
  };
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
    this.addEvents(events.map(e => ({
      title: `Attending: ${e.name}`,
      start: e.date,
      color: '#42a5f5'
    })));
  });

  if (this.role === 'EVENT_ORGANIZER') {
    this.calendarService.getOrganizerEvents(this.userId).subscribe(events => {
      this.addEvents(events.map(e => ({
        title: `Organizer: ${e.name}`,
        start: e.date,
        color: '#66bb6a'
      })));
    });
  }

  if (this.role === 'SERVICE_PRODUCT_PROVIDER') {
    this.calendarService.getProviderBookings(this.userId).subscribe(bookings => {
      this.addEvents(bookings.map(b => ({
        title: `Booking: ${b.serviceProductName}`,
        start: b.date,
        color: '#ef5350'
      })));
    });
  }
}


  private addEvents(newEvents: any[]): void {
    const existingEvents = (this.calendarOptions.events as any[]) || [];
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...existingEvents, ...newEvents]
    };
  }
}
