import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PagedResponse } from '../shared/model/paged-response.model';
import { Product } from '../model/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  
  private apiHost = `${environment.apiHost}api/products`;
  
  constructor(private httpClient: HttpClient) { }
  
  add(product: Product) : Observable<Product> {
    return this.httpClient.post<Product>(this.apiHost, product)
  }

  update(product: Product, id: number): Observable<Product> {
    return this.httpClient.put<Product>(`${this.apiHost}/${id}`, product);
  }

  getProduct(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiHost}/${id}`)
  }

  getAll(pageProperties?: any) : Observable<Product[]> {
    let params = new HttpParams();
    if(pageProperties) {
      params = params
      .set('page', pageProperties.page)
      .set('size', pageProperties.pageSize)
    }
    return this.httpClient.get<Product[]>(`${this.apiHost}/mine`, { params: params});
  }

  deleteProduct(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiHost}/${id}`);
  }
  filter(categories?: number[], eventTypes?: number[], minPrice?: number, maxPrice?: number, available?: boolean): Observable<Product[]> {
    let params = new HttpParams();
    if (categories && categories.length > 0) {
      params = params.set('categories', categories.join(','));
    }
    if (eventTypes && eventTypes.length > 0) {
      params = params.set('eventTypes', eventTypes.join(','));
    }
    if (minPrice !== undefined) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice !== undefined) {
      params = params.set('maxPrice', maxPrice.toString());
    }
    if (available !== undefined) {
      params = params.set('available', available.toString());
    }
    return this.httpClient.get<Product[]>(`${this.apiHost}/filter`, { params });
  }
}
