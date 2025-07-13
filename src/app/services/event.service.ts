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

  private apiUrl = `${environment.apiHost}api/events`;

  constructor(private httpClient: HttpClient) { }

  add(event: Event) : Observable<Event> {
    console.log(this.apiUrl)
    return this.httpClient.post<Event>(this.apiUrl, event)
  }

  getEvent(id: number): Observable<Event> {
    return this.httpClient.get<Event>(`${this.apiUrl}/${id}`);
  }

  getAll(pageProperties?: any) : Observable<PagedResponse<Event>> {
    let params = new HttpParams();
    if(pageProperties) {
      params = params
      .set('page', pageProperties.page)
      .set('size', pageProperties.pageSize)
    }
    return this.httpClient.get<PagedResponse<Event>>(this.apiUrl, { params: params});
  }
}
