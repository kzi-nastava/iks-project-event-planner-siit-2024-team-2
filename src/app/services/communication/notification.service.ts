import { inject, Injectable } from '@angular/core';
import { Message } from '../../model/communication/message';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { PagedModel } from '../../shared/model/paged-model';
import { NotificationDto } from '../dtos/communication/notification.dto';
import { Notification } from '../../model/communication/notification';
import { buildHttpParams } from '../../utils/http-utils';
import { PageParams } from '../../parameters/page-params';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiHost}api/notifications`;
  private httpClient = inject(HttpClient);

  constructor() { }

  getAll(pageParams: PageParams): Observable<PagedModel<Notification>> {
    return this.httpClient.get<PagedModel<Notification>>(this.apiUrl, { params: buildHttpParams(pageParams) });
  }

  getAllForCurrentUser(pageParams: PageParams, loadedTime: Date | null = null): Observable<PagedModel<Notification>> {
    let params = buildHttpParams(pageParams);
    if (loadedTime)
      params = params.append('sentAt', loadedTime.toISOString());
    return this.httpClient.get<PagedModel<Notification>>(`${this.apiUrl}/mine`, { params: params });
  }
  
  dismiss(ids: number[]) {
    return this.httpClient.post(`${this.apiUrl}/dismiss`, ids);
  }

  seen(ids: number[]) {
    return this.httpClient.post(`${this.apiUrl}/seen`, ids);
  }

  delete(notificationId: number) {
    return this.httpClient.delete(`${this.apiUrl}/${notificationId}`);
  }

  update(notification: NotificationDto, id: number) {
    return this.httpClient.put<Notification>(`${this.apiUrl}/${id}`, notification);
  }

  add(notification: NotificationDto) : Observable<Notification> {
    return this.httpClient.post<Notification>(this.apiUrl, notification)
  }
}
