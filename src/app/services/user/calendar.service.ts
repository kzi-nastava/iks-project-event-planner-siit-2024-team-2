import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking } from '../../model/budget/booking';
import { Event } from '../../model/event/event';

export interface EventDto {
  id: number;
  name: string;
  description: string;
  date: string; 
}

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl = `${environment.apiHost}api/calendar`;

  constructor() {}
  httpClient = inject(HttpClient);

  getAttendingEvents(userId: number): Observable<EventDto[]> {
    return this.httpClient.get<EventDto[]>(`${this.apiUrl}/attending`);
  }

  getOrganizerEvents(organizerId: number): Observable<Event[]> {
    return this.httpClient.get<Event[]>(`${this.apiUrl}/organized`);
  }

  getProviderBookings(providerId: number): Observable<Booking[]> {
    return this.httpClient.get<Booking[]>(`${this.apiUrl}/bookings`);
  }
}
