import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PriceListDto } from './dtos/service-product/price-list.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {
  private apiUrl = `${environment.apiHost}api/price-list`; 
  
    constructor(private httpClient: HttpClient) { }
  
    // get all services/products of the same provider
    getBySppId(sppId: number): Observable<PriceListDto[]> {
      return this.httpClient.get<PriceListDto[]>(`${this.apiUrl}/${sppId}`);
    }

    update(id: number, price: number, discount: number): Observable<PriceListDto> {
      return this.httpClient.put<PriceListDto>(`${this.apiUrl}/${id}?price=${price}&discount=${discount}`, {});
    }
}
