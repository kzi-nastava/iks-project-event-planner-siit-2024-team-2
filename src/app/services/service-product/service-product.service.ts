import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServiceProduct } from '../../model/service-product/service-product';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedResponse } from '../../shared/model/paged-response.model';
import { ServiceProductFilterParams } from '../../parameters/service-product-filter-params';
import { ServiceProductSummaryDto } from '../dtos/service-product/service-product-summary.dto';
import { buildHttpParams } from '../../utils/http-utils';

@Injectable({
  providedIn: 'root'
})
export class ServiceProductService {
  private apiUrl = `${environment.apiHost}api/service-products`;
  httpClient = inject(HttpClient);

  get(id: number): Observable<ServiceProduct> {
    return this.httpClient.get<ServiceProduct>(`${this.apiUrl}/${id}`);
  }

  getAll(filters?: ServiceProductFilterParams): Observable<PagedResponse<Event>> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<PagedResponse<Event>>(this.apiUrl, { params });
  }

  getAllSummaries(filters?: ServiceProductFilterParams): Observable<PagedResponse<ServiceProductSummaryDto>> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<PagedResponse<ServiceProductSummaryDto>>(this.apiUrl + "/summaries", { params });
  }

  getTop5(): Observable<ServiceProductSummaryDto[]> {
    return this.httpClient.get<ServiceProductSummaryDto[]>(this.apiUrl + "/top5");
  }
}
