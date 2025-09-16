import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PageParams } from '../parameters/page-params';
import { buildHttpParams } from '../utils/http-utils';
import { PagedModel } from '../shared/model/paged-model';
import { Observable } from 'rxjs';
import { PendingBookingDto } from '../dto/budget/pending-booking.dto';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = `${environment.apiHost}api/bookings`;
  private httpClient = inject(HttpClient);

  accept(id: number) {
    return this.httpClient.post<void>(`${this.apiUrl}/${id}/accept`, {});
  }

  mine(pageProperties?: PageParams): Observable<PagedModel<PendingBookingDto>> {
    const params = buildHttpParams(pageProperties);
    return this.httpClient.get<PagedModel<PendingBookingDto>>(`${this.apiUrl}/mine`, { params: params });
  }

  delete(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
