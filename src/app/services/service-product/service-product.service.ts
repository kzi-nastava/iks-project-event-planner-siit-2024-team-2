import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ServiceProduct } from '../../model/service-product/service-product';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedModel } from '../../shared/model/paged-model';
import { ServiceProductFilterParams } from '../../parameters/service-product-filter-params';
import { ServiceProductSummaryDto } from '../dtos/service-product/service-product-summary.dto';
import { buildHttpParams } from '../../utils/http-utils';
import { ServiceProductFilteringValues } from '../dtos/service-product/service-product-filtering-values.dto';
import { EventType } from '../../model/event/event-type';

@Injectable({
  providedIn: 'root'
})
export class ServiceProductService {
  private apiUrl = `${environment.apiHost}api/service-products`;
  httpClient = inject(HttpClient);

  get(id: number): Observable<ServiceProduct> {
    return this.httpClient.get<ServiceProduct>(`${this.apiUrl}/${id}`);
  }

  getAll(filters?: ServiceProductFilterParams): Observable<PagedModel<Event>> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<PagedModel<Event>>(this.apiUrl, { params });
  }

  getAllSummaries(filters?: ServiceProductFilterParams): Observable<PagedModel<ServiceProductSummaryDto>> {
    const params = buildHttpParams(filters)
    return this.httpClient.get<PagedModel<ServiceProductSummaryDto>>(this.apiUrl + "/summaries", { params });
  }

  getTop5(): Observable<ServiceProductSummaryDto[]> {
    return this.httpClient.get<ServiceProductSummaryDto[]>(this.apiUrl + "/top5");
  }

  getFilteringValues(): Observable<ServiceProductFilteringValues> {
    return this.httpClient.get<ServiceProductFilteringValues>(this.apiUrl + "/filtering-values");
  }

  getCategoriesByEventType(eventTypeId: number): Observable<string[]> {
    return this.httpClient.get<string[]>(`${this.apiUrl}/sp-categories/by-event-type`, {
      params: { eventTypeId: eventTypeId.toString() }
    });
  }
}
