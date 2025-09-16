import { inject, Injectable } from '@angular/core';
import { Service } from '../../model/service-product/service';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import { PagedModel } from '../../shared/model/paged-model';
import { ServiceCardDto } from '../../dto/service-product/service-card-dto.dto';
import { CreateServiceDto } from '../../dto/service-product/create-service.dto';
import { PageParams } from '../../parameters/page-params';
import { DateRangeDto } from '../../dto/utils/date-range.dto';
import { ServiceProductSummaryDto } from '../../dto/service-product/service-product-summary.dto';
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
    return this.httpClient.get<ServiceCardDto[]>(this.apiUrl + '/all');
  }

   getMyServiceCards(
    page = 0,
    size?: number,
    name = '',
    categoryIds?: number[],
    available?: boolean,
    minPrice?: number,
    maxPrice?: number,
    availableEventTypeIds?: number[]
  ): Observable<PagedModel<ServiceProductSummaryDto>> {
    let params = new HttpParams().set('page', page);

    if (size !== undefined) params = params.set('size', size);
    if (name) params = params.set('name', name);
    if (categoryIds && categoryIds.length > 0) {
      categoryIds.forEach(id => params = params.append('categoryIds', id));
    }
    if (available !== undefined && available !== null) params = params.set('available', available);
    if (minPrice !==  undefined && minPrice !== null) params = params.set('minPrice', minPrice);
    if (maxPrice !== undefined && maxPrice !== null) params = params.set('maxPrice', maxPrice);
    if (availableEventTypeIds && availableEventTypeIds.length > 0) {
      availableEventTypeIds.forEach(id => params = params.append('availableEventTypeIds', id));
    }
    console.log(params)

    return this.httpClient.get<PagedModel<ServiceProductSummaryDto>>(`${this.apiUrl}`, { params });
  }

  getMine(): Observable<ServiceCardDto[]> {
    return this.httpClient.get<ServiceCardDto[]>(this.apiUrl + '/mine');
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