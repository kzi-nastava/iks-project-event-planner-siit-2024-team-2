import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarOptions, EventClickArg, EventInput } from '@fullcalendar/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarService } from '../../services/user/calendar.service';
import { AuthService } from '../../services/auth/auth-service.service';
import { Router } from '@angular/router';
import { addHours } from 'date-fns';
import { Booking } from '../../model/budget/booking';
import { Event } from '../../model/event/event';

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
    eventClick: this.onEventClick.bind(this)
  };
  attendingEvents: Event[] = [];
  organizerEvents: Event[] = [];
  providerBookings: Booking[] = [];
  authService = inject(AuthService);
  role = this.authService.getUserRole();
  userId = 1;

  calendarService = inject(CalendarService);
  router = inject(Router);

  ngOnInit(): void {
    this.userId = Number(localStorage.getItem('userId'));

    this.calendarService.getAttendingEvents().subscribe(events => {
      this.addEvents(events.map(e => ({
        title: `Attending: ${e.name}`,
        start: e.date,
        color: '#42a5f5',
        url: `/event-details?id=${e.id}`
      })));
    });

    if (this.role === 'EVENT_ORGANIZER') {
      this.calendarService.getOrganizerEvents().subscribe(events => {
        this.addEvents(events.map(e => ({
          title: `Organizer: ${e.name}`,
          start: e.date,
          color: '#66bb6a',
          url: `/event-details?id=${e.id}`    
        })));
      });
    }

    if (this.role === 'SERVICE_PRODUCT_PROVIDER') {
      this.calendarService.getProviderBookings().subscribe(bookings => {
        this.addEvents(bookings.map(b => ({
          title: `Booking: ${b.service.name}`,
          start: b.date,
          end: addHours(b.date, b.duration),
          color: '#ef5350',
          url: `/sp-details?id=${b.service.id}`
        })));
      });
    }
  }


  private addEvents(newEvents: EventInput[]): void {
    const existingEvents = (this.calendarOptions.events as EventInput[]) || [];
    this.calendarOptions = {
      ...this.calendarOptions,
      events: [...existingEvents, ...newEvents]
    };
  }

  onEventClick(info: EventClickArg): void {
    console.log(info);
    info.jsEvent.preventDefault();
    if (info.event.url) {
      this.router.navigateByUrl(info.event.url);
    }
  }
}
