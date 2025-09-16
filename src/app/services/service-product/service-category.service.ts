import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ServiceCategory } from '../../model/service-product/service-category';

@Injectable({
  providedIn: 'root'
})
export class ServiceCategoryService {
    apiHost = `${environment.apiHost}api/sp-categories`;
    httpClient = inject(HttpClient);
  
    add(serviceCategory: ServiceCategory) : Observable<ServiceCategory> {
      return this.httpClient.post<ServiceCategory>(this.apiHost, serviceCategory)
    }
  
    getEventType(id: number): Observable<ServiceCategory> {
      return this.httpClient.get<ServiceCategory>(`${this.apiHost}/${id}`)
    }
  
    getAll() : Observable<ServiceCategory[]> {
      return this.httpClient.get<ServiceCategory[]>(this.apiHost);
    }
}
