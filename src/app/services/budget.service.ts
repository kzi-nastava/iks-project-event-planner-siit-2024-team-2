import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateBudgetDto } from './dtos/event/create-budget.dto';
import { Observable } from 'rxjs';
import { Budget } from '../model/budget/budget';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {
  
  private apiUrl = `${environment.apiHost}api/budgets`; 

  constructor(private httpClient: HttpClient) { }

  add(budget: CreateBudgetDto): Observable<Budget> {
    return this.httpClient.post<Budget>(this.apiUrl, budget);
  }

  setNewAmount(id: number, newAmount: number) {
    return this.httpClient.put(`${this.apiUrl}/${id}`, newAmount);
  }

  delete(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.apiUrl}/${id}`);
  }

  getBudget(id: number): Observable<Budget> {
    return this.httpClient.get<Budget>(`${this.apiUrl}/${id}`);
  }
}
