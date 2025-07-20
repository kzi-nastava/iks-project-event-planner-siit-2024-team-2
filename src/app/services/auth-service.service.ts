import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from './dtos/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiHost}api/auth`; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.jwt) {
          localStorage.setItem('token', response.jwt); 
          localStorage.setItem('userId', response.id.toString());
        }
      })
    );
  }

  register(email: string, password: string, firstName: string, lastName: string, address: string, phoneNumber: string, userRole: 2 | 3): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/signup`, { email, password, firstName, lastName, address, phoneNumber, userRole });
  }

  registerCompany(email: string, password: string, firstName: string, lastName: string, companyName: string, companyDescription: string, address: string, phoneNumber: string, userRole: 2 | 3): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/signup/company`, { email, password, firstName, lastName, companyName, companyDescription, address, phoneNumber, userRole });
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
