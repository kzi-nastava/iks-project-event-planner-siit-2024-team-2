import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Product } from '../model/service-product/product';
import { PageParams } from '../parameters/page-params';
import { ProductDetailsDto } from './dtos/service-product/product-details.dto';
import { ProductDto } from './dtos/service-product/product.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiHost = `${environment.apiHost}api/products`;
  httpClient = inject(HttpClient);
  
  add(product: ProductDto) : Observable<Product> {
    return this.httpClient.post<Product>(this.apiHost, product)
  }

  update(product: ProductDto, id: number): Observable<Product> {
    return this.httpClient.put<Product>(`${this.apiHost}/${id}`, product);
  }

  getProduct(id: number): Observable<ProductDetailsDto> {
    return this.httpClient.get<ProductDetailsDto>(`${this.apiHost}/${id}`)
  }

  getAll(pageProperties?: PageParams) : Observable<Product[]> {
    let params = new HttpParams();
    if(pageProperties) {
      params = params
      .set('page', pageProperties.page)
      .set('size', pageProperties.size)
    }
    return this.httpClient.get<Product[]>(`${this.apiHost}/mine`, { params: params});
  }

  delete(id: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiHost}/${id}`);
  }
  filter(category?: number, eventTypes?: number[], minPrice?: number, maxPrice?: number, available?: boolean): Observable<Product[]> {
    let params = new HttpParams();
    if (category) {
      params = params.set('category', category.toString());
    }
    if (eventTypes && eventTypes.length > 0) {
      params = params.set('eventTypes', eventTypes.join(','));
    }
    if (minPrice !== undefined && minPrice !== null) {
      params = params.set('minPrice', minPrice.toString());
    }
    if (maxPrice !== undefined && maxPrice !== null) {
      params = params.set('maxPrice', maxPrice.toString());
    }
    if (available !== undefined && available !== null) {
      params = params.set('available', available.toString());
    }
    return this.httpClient.get<Product[]>(`${this.apiHost}/filter`, { params });
  }
}
