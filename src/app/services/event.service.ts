import { Injectable } from '@angular/core';
import { Event } from '../model/event';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import { PagedResponse } from '../shared/model/paged-response.model';
@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }

  add(Event: Event) : Observable<Event> {
    return this.httpClient.post<Event>(environment.apiHost + "api/events/", Event)
  }

  getEvent(id: number): Observable<Event> {
    return this.httpClient.get<Event>(environment.apiHost + "api/events/" + id)
  }

  getAll(pageProperties?: any) : Observable<PagedResponse<Event>> {
    let params = new HttpParams();
    if(pageProperties) {
      params = params
      .set('page', pageProperties.page)
      .set('size', pageProperties.pageSize)
    }
    return this.httpClient.get<PagedResponse<Event>>(environment.apiHost + `api/events/`, { params: params});
  }
}
