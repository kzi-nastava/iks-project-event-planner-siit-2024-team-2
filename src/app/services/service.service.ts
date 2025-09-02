import { inject, Injectable } from '@angular/core';
import { Service } from '../model/service-product/service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import { PagedModel } from '../shared/model/paged-model';
import { ServiceCardDto } from './dtos/service-product/service-card-dto.dto';
import { CreateServiceDto } from './dtos/service-product/create-service.dto';
import { PageParams } from '../parameters/page-params';
import { DateRangeDto } from './dtos/utils/date-range.dto';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = `${environment.apiHost}api/services`; 
  httpClient = inject(HttpClient);

  add(service: CreateServiceDto): Observable<Service> {
    return this.httpClient.post<Service>(this.apiUrl, service);
  }

  update(id: number, service: CreateServiceDto): Observable<Service> {
    return this.httpClient.put<Service>(`${this.apiUrl}/${id}`, service);
  }

  delete(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  getService(id: number): Observable<Service> {
    return this.httpClient.get<Service>(`${this.apiUrl}/${id}`);
  }

  getAllCards(): Observable<ServiceCardDto[]> {
    return this.httpClient.get<ServiceCardDto[]>(this.apiUrl);
  }

  getAll(pageProperties?: PageParams) : Observable<PagedModel<Service>> {
    let params = new HttpParams();
    if(pageProperties) {
      params = params
      .set('page', pageProperties.page)
      .set('size', pageProperties.size)
    }
    return this.httpClient.get<PagedModel<Service>>(this.apiUrl, { params: params});
  }

  getAvailability(serviceId: number, eventId: number): Observable<DateRangeDto[]> {
    const params = new HttpParams().set('eventId', eventId);
    return this.httpClient.get<DateRangeDto[]>(`${this.apiUrl}/${serviceId}/availability`, {params: params});
  }
}