import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { UserDto } from './dtos/user/user';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private usersUrl = `${environment.apiHost}api/users`; 
  private authUrl = `${environment.apiHost}api/auth`; 
  private http = inject(HttpClient);

  uploadProfilePicture(imageName: string, userId: number) {
    return this.http.post<any>(`${this.usersUrl}/${userId}/upload-picture`, {imageName: imageName});
  }

  removeProfilePicture(userId: number) {
    return this.http.delete(`${this.usersUrl}/${userId}/remove-picture`);
  }

  getUserData(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.usersUrl}/${userId}`);
  }

  updatePersonalInfo(userInfo: any, userId: string): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.usersUrl}/${userId}`, userInfo);
  }

  getCompanyData(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.usersUrl}/company/${userId}`);
  }
  
  updateCompanyInfo(companyInfo: any, userId: string): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.usersUrl}/company/${userId}`, companyInfo);
  }

  changePassword(oldPassword: string, newPassword: string, userId: string): Observable<any> {
    return this.http.post(`${this.authUrl}/reset-password/${Number(userId)}`, { oldPassword, newPassword });
  }

  delete(userId: number): Observable<any> {
    return this.http.delete(`${this.usersUrl}/${userId}`);
  }

  updateEventTypes(selectedEventTypes: string[]): Observable<any> {
    return this.http.put(`${this.usersUrl}/event-types`, { eventTypes: selectedEventTypes });
  }
}
