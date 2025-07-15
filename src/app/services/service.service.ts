import { Injectable } from '@angular/core';
import { Service } from '../model/service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import { PagedModel } from '../shared/model/paged-model';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = `${environment.apiHost}api/service-products`; 

  constructor(private httpClient: HttpClient) { }

  add(service: Service) : Observable<Service> {
    return this.httpClient.post<Service>(this.apiUrl, service);
  }

  getService(id: number): Observable<Service> {
    return this.httpClient.get<Service>(`${this.apiUrl}/${id}`);
  }

  getAll(pageProperties?: any) : Observable<PagedModel<Service>> {
    let params = new HttpParams();
    if(pageProperties) {
      params = params
      .set('page', pageProperties.page)
      .set('size', pageProperties.pageSize)
    }
    return this.httpClient.get<PagedModel<Service>>(this.apiUrl, { params: params});
  }
}