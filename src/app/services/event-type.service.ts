import { inject, Injectable } from '@angular/core';
import { EventType } from '../model/event/event-type';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedModel } from '../shared/model/paged-model';
import { EventFilterParams } from '../parameters/event-filter-params';
import { buildHttpParams } from '../utils/http-utils';
import { EventTypeDto } from '../dto/event/event-type.dto';
import { CreateEventType } from '../dto/event/create-event-type';

@Injectable({
  providedIn: 'root'
})
export class EventTypeService {
  private apiUrl = `${environment.apiHost}api/event-types`;
  private httpClient = inject(HttpClient);
  
  add(eventType: CreateEventType) : Observable<EventType> {
    return this.httpClient.post<EventType>(this.apiUrl, eventType)
  }

  getEventType(id: number): Observable<EventType> {
    return this.httpClient.get<EventType>(`${this.apiUrl}/` + id)
  }

  update(id: number, eventType: CreateEventType) {
    return this.httpClient.put<EventType>(`${this.apiUrl}/${id}`, eventType);
  }

  getAll(filters?: EventFilterParams): Observable<EventType[]> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<EventType[]>(this.apiUrl, { params: params });
  }
  getAllPaginated(filters?: EventFilterParams): Observable<PagedModel<EventTypeDto>> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<PagedModel<EventTypeDto>>(this.apiUrl+ "/paginated", { params });
  }

  delete(eventTypeId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${eventTypeId}`);
  }
}
