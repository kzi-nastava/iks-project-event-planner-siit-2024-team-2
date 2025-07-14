import { Injectable } from '@angular/core';
import { Event } from '../model/event';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import { PagedResponse } from '../shared/model/paged-response.model';
import { EventFilterParams } from '../parameters/event-filter-params';
import { EventSummaryDto } from './dtos/event/event-summary.dto';
import { buildHttpParams } from '../utils/http-utils';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = `${environment.apiHost}api/events`;

  constructor(private httpClient: HttpClient) { }

  add(event: Event) : Observable<Event> {
    console.log(this.apiUrl)
    return this.httpClient.post<Event>(this.apiUrl, event)
  }

  getEvent(id: number): Observable<Event> {
    return this.httpClient.get<Event>(`${this.apiUrl}/${id}`);
  }

  getAll(filters?: EventFilterParams): Observable<PagedResponse<Event>> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<PagedResponse<Event>>(this.apiUrl, { params });
  }

  getAllSummaries(filters?: EventFilterParams): Observable<PagedResponse<EventSummaryDto>> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<PagedResponse<EventSummaryDto>>(this.apiUrl + "/summaries", { params });
  }

  getTop5(): Observable<EventSummaryDto[]> {
    return this.httpClient.get<EventSummaryDto[]>(this.apiUrl + "/top5");
  }
}
