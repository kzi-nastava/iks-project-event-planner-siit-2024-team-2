import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServiceProduct } from '../../model/service-product/service-product';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResponse } from '../../shared/model/paged-response.model';

@Injectable({
  providedIn: 'root'
})
export class ServiceProductService {
  private apiUrl = `${environment.apiHost}api/service-products`;
  httpClient = inject(HttpClient);

  get(id: number): Observable<ServiceProduct> {
    return this.httpClient.get<ServiceProduct>(`${this.apiUrl}/${id}`);
  }

  getAll(pageProperties?: any) : Observable<PagedResponse<ServiceProduct>> {
    let params = new HttpParams();
    if(pageProperties) {
      params = params
      .set('page', pageProperties.page)
      .set('size', pageProperties.pageSize)
    }
    return this.httpClient.get<PagedResponse<ServiceProduct>>(this.apiUrl, { params: params});
  }
}
