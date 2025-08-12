import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from './dtos/login-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiHost}api/auth`; 
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.jwt && typeof window !== 'undefined') {
          localStorage.setItem('token', response.jwt); 
          this.isLoggedInSubject.next(true);
          localStorage.setItem('userId', response.id.toString());
          localStorage.setItem('role', response.role.toString());
          console.log(localStorage)
        }
      })
    );
  }
  private hasToken(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('token');
    }
    return false;
  }
  register(email: string, password: string, firstName: string, lastName: string, address: string, phoneNumber: string, userRole: 2 | 3): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/signup`, { email, password, firstName, lastName, address, phoneNumber, userRole });
  }

  registerCompany(email: string, password: string, firstName: string, lastName: string, companyName: string, companyDescription: string, address: string, phoneNumber: string, userRole: 2 | 3): Observable<boolean> {
    return this.http.post<boolean>(`${this.apiUrl}/signup/company`, { email, password, firstName, lastName, companyName, companyDescription, address, phoneNumber, userRole });
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      this.isLoggedInSubject.next(false);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getUserRole(): 'EVENT_ORGANIZER' | 'SERVICE_PRODUCT_PROVIDER' | 'ADMIN' | null {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      return role as 'EVENT_ORGANIZER' | 'SERVICE_PRODUCT_PROVIDER' | 'ADMIN' | null;
    }
    return null;
  }
}
