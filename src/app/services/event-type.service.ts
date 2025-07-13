import { Injectable } from '@angular/core';
import { EventType } from '../model/event-type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedResponse } from '../shared/model/paged-response.model';
import { CreateEventType } from '../model/create-event-type';

@Injectable({
  providedIn: 'root'
})
export class EventTypeService {

    private apiUrl = `${environment.apiHost}api/event-types`;

    constructor(private httpClient: HttpClient) { }
  
    add(eventType: CreateEventType) : Observable<EventType> {
      return this.httpClient.post<EventType>(this.apiUrl, eventType)
    }
  
    getEventType(id: number): Observable<EventType> {
      return this.httpClient.get<EventType>(`${this.apiUrl}/` + id)
    }
  
    getAll() : Observable<EventType[]> {
      return this.httpClient.get<EventType[]>(environment.apiHost + `api/event-types`);
    }
}
