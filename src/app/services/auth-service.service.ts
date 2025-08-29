import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginResponse } from './dtos/auth/login-response';
import { Q } from '@angular/cdk/keycodes';
import { QuickLoginDto } from './dtos/auth/quick-login.dto';
import { UserRole } from './dtos/user/user-role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiHost}api/auth`; 
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  private suspendedAtSubject = new BehaviorSubject<Date | null>(null);
  public suspendedAt$ = this.suspendedAtSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap({ 
        next: response => this.handleLoginResponse(response), 
        error: err => this.handleLoginError(err) 
      })
    );
  }

  quickLogin(token: string): Observable<LoginResponse> { 
    let body: QuickLoginDto = { invitationToken: token };
    return this.http.post<LoginResponse>(`${this.apiUrl}/quick-login`, body).pipe(
      tap({ 
        next: response => this.handleLoginResponse(response), 
        error: err => this.handleLoginError(err) 
      })
    );
  }

  private handleLoginResponse(response: LoginResponse) {
    if (response.jwt && typeof window !== 'undefined') {
      localStorage.setItem('token', response.jwt); 
      this.isLoggedInSubject.next(true);
      localStorage.setItem('userId', response.id.toString());
      localStorage.setItem('role', response.role.toString());
      localStorage.setItem('email', response.email.toString());
    }
  }

  private handleLoginError(err: HttpErrorResponse) {
    if (err.status === 403) {
      let error = err.error as LoginResponse;
      if (error?.suspendedAt) {
        this.suspendedAtSubject.next(error.suspendedAt);
      }
    }
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
      localStorage.removeItem('email');
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

  getUserRole(): UserRole | null {
    if (typeof window !== 'undefined') {
      const role = localStorage.getItem('role');
      return role as UserRole | null;
    }
    return null;
  }

  getUserId(): string {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('userId') as string;
    }
    return '';
  }

  getUserEmail(): string {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem('email') as string;
    }
    return '';
  }
}
