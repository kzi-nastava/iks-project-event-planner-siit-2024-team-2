import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EventSummaryDto } from '../dtos/event/event-summary.dto';
import { ServiceProductSummaryDto } from '../dtos/service-product/service-product-summary.dto';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = `${environment.apiHost}api/users`;
  httpClient = inject(HttpClient);

  suspendUser(userEmail: string): Observable<void> {
    return this.httpClient.post<void>(`${this.usersUrl}/${userEmail}/suspend`, {});
  }

  getFavoriteEvents(userId: number) {
    return this.httpClient.get<EventSummaryDto[]>(`${environment.apiHost}api/users/${userId}/favorite-events`);
  }

  addFavoriteEvent(userId: number, eventId: number) {
    return this.httpClient.post(`${environment.apiHost}api/users/${userId}/favorite-events/${eventId}`, {});
  }

  removeFavoriteEvent(userId: number, eventId: number) {
    return this.httpClient.delete(`${environment.apiHost}api/users/${userId}/favorite-events/${eventId}`);
  }

  getFavoriteServiceProducts(userId: number) {
    return this.httpClient.get<ServiceProductSummaryDto[]>(`${environment.apiHost}api/users/${userId}/favorite-service-products`);
  }

  addFavoriteServiceProduct(userId: number, serviceProductId: number) {
    return this.httpClient.post(`${environment.apiHost}api/users/${userId}/favorite-service-products/${serviceProductId}`, {});
  }

  removeFavoriteServiceProduct(userId: number, serviceProductId: number) {
    return this.httpClient.delete(`${environment.apiHost}api/users/${userId}/favorite-service-products/${serviceProductId}`);
  }

}
