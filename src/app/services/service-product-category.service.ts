import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ServiceProductCategory } from '../model/service-product-category';
import { Observable } from 'rxjs';
import { ServiceProductCategoryDto } from './dtos/service-product/service-product-category.dto';

@Injectable({
  providedIn: 'root'
})
export class ServiceProductCategoryService {
  private apiUrl = `${environment.apiHost}api/sp-categories`; 

  constructor(private httpClient: HttpClient) { }

  add(category: ServiceProductCategoryDto) : Observable<ServiceProductCategory> {
    return this.httpClient.post<ServiceProductCategory>(this.apiUrl, category);
  }

  getAll(): Observable<ServiceProductCategory[]> {
    return this.httpClient.get<ServiceProductCategory[]>(this.apiUrl);
  }

  getById(id: number): Observable<ServiceProductCategory> {
    return this.httpClient.get<ServiceProductCategory>(`${this.apiUrl}/${id}`);
  }

  getByName(name: string): Observable<ServiceProductCategory> {
    return this.httpClient.get<ServiceProductCategory>(`${this.apiUrl}/name/${name}`);
  }

  update(id: number, category:ServiceProductCategoryDto): Observable<ServiceProductCategory> {
    return this.httpClient.put<ServiceProductCategory>(`${this.apiUrl}/${id}`, category);
  }
}
