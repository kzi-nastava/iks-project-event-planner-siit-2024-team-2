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

  getEvent(id: number): Observable<Product> {
    return this.httpClient.get<Product>(`${this.apiHost}/${id}`)
  }

  getAll(pageProperties?: any) : Observable<Product[]> {
    let params = new HttpParams();
    if(pageProperties) {
      params = params
      .set('page', pageProperties.page)
      .set('size', pageProperties.pageSize)
    }
    return this.httpClient.get<Product[]>(this.apiHost, { params: params});
  }
}
