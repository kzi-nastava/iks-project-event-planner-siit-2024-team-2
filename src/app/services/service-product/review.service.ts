import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ServiceProductReview } from '../../model/service-product/service-product-review';
import { Observable } from 'rxjs';
import { ServiceProductReviewDto } from '../dtos/service-product/review/service-product-review.dto';
import { PagedModel } from '../../shared/model/paged-model';
import { ServiceProductReviewStatusDto } from '../dtos/service-product/review/service-product-review-status.dto';
import { ServiceProductReviewCommentDto } from '../dtos/service-product/review/service-product-review-comment.dto';
import { buildHttpParams } from '../../utils/http-utils';
import { PageParams } from '../../parameters/page-params';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = `${environment.apiHost}api/reviews`;
  readonly httpClient = inject(HttpClient);

  getAll() : Observable<ServiceProductReview[]> {
    return this.httpClient.get<ServiceProductReview[]>(`${this.apiUrl}`);
  }
  get(id: number) : Observable<ServiceProductReview> {
    return this.httpClient.get<ServiceProductReview>(`${this.apiUrl}/${id}`);
  }
  add(review: ServiceProductReviewDto) : Observable<ServiceProductReview> {
    return this.httpClient.post<ServiceProductReview>(`${this.apiUrl}`, review);
  }
  update(id: number, review: ServiceProductReviewDto) : Observable<ServiceProductReview> {
    return this.httpClient.put<ServiceProductReview>(`${this.apiUrl}/${id}`, review);
  }
  delete(id: number) : Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllPending(PageParams?: PageParams) : Observable<PagedModel<ServiceProductReview>> {
    const params = buildHttpParams(PageParams)
    return this.httpClient.get<PagedModel<ServiceProductReview>>(`${this.apiUrl}/pending`, { params: params });
  }
  approve(id: number) : Observable<ServiceProductReviewStatusDto> {
    return this.httpClient.post<ServiceProductReviewStatusDto>(`${this.apiUrl}/approve`, id);
  }
  updateComment(id: number, comment: string) : Observable<ServiceProductReviewCommentDto> {
    return this.httpClient.put<ServiceProductReviewCommentDto>(`${this.apiUrl}/${id}/comment`, comment);
  }
}
