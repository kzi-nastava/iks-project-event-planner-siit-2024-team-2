import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ServiceProductCategory } from '../model/service-product-category';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceProductCategoryService {
  private apiUrl = `${environment.apiHost}api/sp-categories`; 

  constructor(private httpClient: HttpClient) { }

  add(category: ServiceProductCategory) : Observable<ServiceProductCategory> {
    return this.httpClient.post<ServiceProductCategory>(this.apiUrl, category);
  }

  getAll(): Observable<ServiceProductCategory[]> {
    return this.httpClient.get<ServiceProductCategory[]>(this.apiUrl);
  }
}
