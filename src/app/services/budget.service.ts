import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateBudgetDto } from './dtos/budget/create-budget.dto';
import { Observable } from 'rxjs';
import { Budget } from '../model/budget/budget';
import { BookingDto } from './dtos/budget/booking.dto';
import { PurchaseDto } from './dtos/budget/purchase.dto';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  
  private apiUrl = `${environment.apiHost}api/budgets`; 
  private httpClient = inject(HttpClient);

  add(budget: CreateBudgetDto): Observable<Budget> {
    return this.httpClient.post<Budget>(this.apiUrl, budget);
  }

  setNewAmount(id: number, newAmount: number) {
    return this.httpClient.put(`${this.apiUrl}/${id}`, newAmount);
  }

  addNewBooking(id: number, booking: BookingDto) {
    return this.httpClient.post(`${this.apiUrl}/${id}/bookings`, booking);
  }

  addNewPurchase(id: number, purchase: PurchaseDto) {
    return this.httpClient.post(`${this.apiUrl}/${id}/purchases`, purchase);
  }

  delete(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  getBudget(id: number): Observable<Budget> {
    return this.httpClient.get<Budget>(`${this.apiUrl}/${id}`);
  }
}
