import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface EventDto {
  id: number;
  name: string;
  description: string;
  date: string; 
}

export interface BookingDto {
  id: number;
  date: string;
  serviceProductName: string;
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

  getOrganizerEvents(organizerId: number): Observable<EventDto[]> {
    return this.httpClient.get<EventDto[]>(`${this.apiUrl}/organized`);
  }

  getProviderBookings(providerId: number): Observable<BookingDto[]> {
    return this.httpClient.get<BookingDto[]>(`${this.apiUrl}/bookings`);
  }
}
