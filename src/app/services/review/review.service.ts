import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { PagedModel } from '../../shared/model/paged-model';
import { ReviewStatusDto } from '../dtos/review/review-status.dto';
import { ReviewCommentDto } from '../dtos/review/review-comment.dto';
import { buildHttpParams } from '../../utils/http-utils';
import { PageParams } from '../../parameters/page-params';
import { Review } from '../../model/review/review';
import { ReviewDto } from '../dtos/review/review.dto';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private readonly apiUrl = `${environment.apiHost}api/reviews`;
  readonly httpClient = inject(HttpClient);

  getAll() : Observable<Review[]> {
    return this.httpClient.get<Review[]>(`${this.apiUrl}`);
  }
  get(id: number) : Observable<Review> {
    return this.httpClient.get<Review>(`${this.apiUrl}/${id}`);
  }
  add(review: ReviewDto) : Observable<Review> {
    return this.httpClient.post<Review>(`${this.apiUrl}`, review);
  }
  update(id: number, review: ReviewDto) : Observable<Review> {
    return this.httpClient.put<Review>(`${this.apiUrl}/${id}`, review);
  }
  delete(id: number) : Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAllPending(PageParams?: PageParams) : Observable<PagedModel<Review>> {
    const params = buildHttpParams(PageParams)
    return this.httpClient.get<PagedModel<Review>>(`${this.apiUrl}/pending`, { params: params });
  }
  approve(id: number) : Observable<ReviewStatusDto> {
    return this.httpClient.post<ReviewStatusDto>(`${this.apiUrl}/${id}/approve`, {});
  }
  updateComment(id: number, comment: string) : Observable<ReviewCommentDto> {
    return this.httpClient.put<ReviewCommentDto>(`${this.apiUrl}/${id}/comment`, comment);
  }
}
