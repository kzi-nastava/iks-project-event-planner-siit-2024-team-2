import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private usersUrl = `${environment.apiHost}api/users`;
  httpClient = inject(HttpClient);

  suspendUser(userEmail: string): Observable<void> {
    return this.httpClient.post<void>(`${this.usersUrl}/${userEmail}/suspend`, {});
  }
}
