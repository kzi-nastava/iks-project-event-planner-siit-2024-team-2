import { inject, Injectable } from '@angular/core';
import { Event } from '../model/event/event';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import { PagedModel } from '../shared/model/paged-model';
import { EventFilterParams } from '../parameters/event-filter-params';
import { EventSummaryDto } from './dtos/event/event-summary.dto';
import { buildHttpParams } from '../utils/http-utils';
import { EventDto } from './dtos/event/event.dto';
import { ActivityDto } from './dtos/event/activity.dto';
import { Activity } from '../model/event/activity';
@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiHost}api/events`;
  httpClient = inject(HttpClient);

  getAgenda(eventId: number) : Observable<Activity[]> {
    return this.httpClient.get<Activity[]>(`${this.apiUrl}/${eventId}/agenda`);
  }

  addActivity(eventId: number, activity: ActivityDto) : Observable<Activity> {
    return this.httpClient.post<Activity>(`${this.apiUrl}/${eventId}/agenda/activity`, activity);
  }

  updateActivity(eventId: number, activityId: number, activity: ActivityDto) : Observable<Activity> {
    return this.httpClient.put<Activity>(`${this.apiUrl}/${eventId}/agenda/activity/${activityId}`, activity);
  }

  deleteActivity(eventId: number, activityId: number) {
    return this.httpClient.delete(`${this.apiUrl}/${eventId}/agenda/activity/${activityId}`);
  }

  delete(eventId: number) : Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${eventId}`);
  }
  update(event: EventDto, id: number) {
    return this.httpClient.put<Event>(`${this.apiUrl}/${id}`, event);
  }


  add(event: EventDto) : Observable<Event> {
    return this.httpClient.post<Event>(this.apiUrl, event)
  }

  getEvent(id: number): Observable<Event> {
    return this.httpClient.get<Event>(`${this.apiUrl}/${id}`);
  }

  getAll(filters?: EventFilterParams): Observable<PagedModel<Event>> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<PagedModel<Event>>(this.apiUrl, { params });
  }

  getAllMine(filters?: EventFilterParams): Observable<PagedModel<Event>> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<PagedModel<Event>>(this.apiUrl + "/mine", { params });
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

  addBudgetToEvent(id: number, budget: any) {
    return this.httpClient.post(`${this.apiUrl}/${id}/budgets`, budget);
  }

  dowloadPdf(eventId: number): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${eventId}/pdf`, { responseType: 'blob' });
  }
}
