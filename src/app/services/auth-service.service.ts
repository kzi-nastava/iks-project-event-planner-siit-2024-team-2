import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from './dtos/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiHost}api/auth/login`; 

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        if (response.jwt) {
          localStorage.setItem('token', response.jwt); 
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
