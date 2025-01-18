import { Injectable } from '@angular/core';
import { EventType } from '../model/event-type';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedResponse } from '../shared/model/paged-response.model';

@Injectable({
  providedIn: 'root'
})
export class EventTypeService {

    constructor(private httpClient: HttpClient) { }
  
    add(EventType: EventType) : Observable<EventType> {
      return this.httpClient.post<EventType>(environment.apiHost + "api/event-types/", EventType)
    }
  
    getEventType(id: number): Observable<EventType> {
      return this.httpClient.get<EventType>(environment.apiHost + "api/event-types/" + id)
    }
  
    getAll() : Observable<EventType[]> {
      return this.httpClient.get<EventType[]>(environment.apiHost + `api/event-types`);
    }
}
