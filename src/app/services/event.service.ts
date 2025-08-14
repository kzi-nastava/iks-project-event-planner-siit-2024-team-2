import { Injectable } from '@angular/core';
import { Event } from '../model/event/event';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import { PagedModel } from '../shared/model/paged-model';
import { EventFilterParams } from '../parameters/event-filter-params';
import { EventSummaryDto } from './dtos/event/event-summary.dto';
import { buildHttpParams } from '../utils/http-utils';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  private apiUrl = `${environment.apiHost}api/events`;
  
  constructor(private httpClient: HttpClient) { }

  getAgenda(eventId: number) {
    return this.httpClient.get(`${this.apiUrl}/${eventId}/agenda`);
  }

  addActivity(eventId: number, activity: any) {
    return this.httpClient.post(`${this.apiUrl}/${eventId}/agenda/activity`, activity);
  }

  updateActivity(eventId: number, activityId: number, activity: any) {
    return this.httpClient.put(`${this.apiUrl}/${eventId}/agenda/activity/${activityId}`, activity);
  }

  deleteActivity(eventId: number, activityId: number) {
    return this.httpClient.delete(`${this.apiUrl}/${eventId}/agenda/activity/${activityId}`);
  }

  delete(eventId: number) {
    return this.httpClient.delete(`${this.apiUrl}/${eventId}`);
  }
  update(event: Event, id: number) {
    return this.httpClient.put<Event>(`${this.apiUrl}/${id}`, event);
  }


  add(event: Event) : Observable<Event> {
    console.log(this.apiUrl)
    return this.httpClient.post<Event>(this.apiUrl, event)
  }

  getEvent(id: number): Observable<Event> {
    return this.httpClient.get<Event>(`${this.apiUrl}/${id}`);
  }

  getAll(filters?: EventFilterParams): Observable<PagedModel<Event>> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<PagedModel<Event>>(this.apiUrl, { params });
  }

  getAllSummaries(filters?: EventFilterParams): Observable<PagedModel<EventSummaryDto>> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<PagedModel<EventSummaryDto>>(this.apiUrl + "/summaries", { params });
  }

  getTop5(): Observable<EventSummaryDto[]> {
    return this.httpClient.get<EventSummaryDto[]>(this.apiUrl + "/top5");
  }
  
  getMaxAttendancesRange(): Observable<number[]> {
    return this.httpClient.get<number[]>(this.apiUrl + "/max-attendances-range");
  }

  dowloadPdf(eventId: number): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${eventId}/pdf`, { responseType: 'blob' });
  }
}
