import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDto } from '../../dto/user/user.dto';
import { User } from '../../model/user/user';
import { UserInfoDto } from '../../dto/user/user-info.dto';
import { CompanyInfoDto } from '../../dto/user/company-info.dto';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private usersUrl = `${environment.apiHost}api/users`; 
  private authUrl = `${environment.apiHost}api/auth`; 
  private http = inject(HttpClient);

  uploadProfilePicture(imageName: string, userId: number) : Observable<User> {
    return this.http.post<User>(`${this.usersUrl}/${userId}/upload-picture`, {imageName: imageName});
  }

  removeProfilePicture(userId: number) : Observable<User> {
    return this.http.delete<User>(`${this.usersUrl}/${userId}/remove-picture`);
  }

  getUserData(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.usersUrl}/${userId}`);
  }

  updatePersonalInfo(userInfo: UserInfoDto, userId: string): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.usersUrl}/${userId}`, userInfo);
  }

  getCompanyData(userId: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${this.usersUrl}/company/${userId}`);
  }
  
  updateCompanyInfo(companyInfo: CompanyInfoDto, userId: string): Observable<UserDto> {
    return this.http.put<UserDto>(`${this.usersUrl}/company/${userId}`, companyInfo);
  }

  changePassword(oldPassword: string, newPassword: string, userId: string): Observable<void> {
    return this.http.post<void>(`${this.authUrl}/reset-password/${Number(userId)}`, { oldPassword, newPassword });
  }

  delete(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.usersUrl}/${userId}`);
  }

  updateEventTypes(selectedEventTypes: string[]): Observable<void> {
    return this.http.put<void>(`${this.usersUrl}/event-types`, { eventTypes: selectedEventTypes });
  }
}
