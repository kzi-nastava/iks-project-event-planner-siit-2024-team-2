import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './dtos/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private usersUrl = `${environment.apiHost}api/users`; 
  private authUrl = `${environment.apiHost}api/auth`; 

  constructor(private http: HttpClient) {}

  getUserData(userId: number): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/${userId}`);
  }

  updatePersonalInfo(userInfo: any, userId: string): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/${userId}`, userInfo);
  }

  getCompanyData(userId: number): Observable<User> {
    return this.http.get<User>(`${this.usersUrl}/company/${userId}`);
  }
  
  updateCompanyInfo(companyInfo: any, userId: string): Observable<User> {
    return this.http.put<User>(`${this.usersUrl}/company/${userId}`, companyInfo);
  }

  changePassword(oldPassword: string, newPassword: string, userId: string): Observable<any> {
    return this.http.post(`${this.authUrl}/reset-password/${Number(userId)}`, { oldPassword, newPassword });
  }

  deactivateAccount(userId: number): Observable<any> {
    return this.http.delete(`${this.usersUrl}/${userId}`);
  }

  updateEventTypes(selectedEventTypes: string[]): Observable<any> {
    return this.http.put(`${this.usersUrl}/event-types`, { eventTypes: selectedEventTypes });
  }
}
