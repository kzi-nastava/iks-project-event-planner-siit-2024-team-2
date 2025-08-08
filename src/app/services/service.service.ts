import { Injectable } from '@angular/core';
import { Service } from '../model/service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import { PagedModel } from '../shared/model/paged-model';
import { ServiceCardDto } from './dtos/service-card-dto.dto';
import { CreateServiceDto } from './dtos/service-product/create-service.dto';
@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  private apiUrl = `${environment.apiHost}api/services`; 

  constructor(private httpClient: HttpClient) { }

  add(service: CreateServiceDto): Observable<Service> {
    return this.httpClient.post<Service>(this.apiUrl, service);
  }

  update(id: number, service: CreateServiceDto): Observable<Service> {
    return this.httpClient.put<Service>(`${this.apiUrl}/${id}`, service);
  }

  getService(id: number): Observable<Service> {
    return this.httpClient.get<Service>(`${this.apiUrl}/${id}`);
  }

  getAllCards(): Observable<ServiceCardDto[]> {
    return this.httpClient.get<ServiceCardDto[]>(this.apiUrl);
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