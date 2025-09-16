import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PriceListDto } from '../dto/service-product/price-list.dto';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PriceListService {
  private apiUrl = `${environment.apiHost}api/price-list`; 
  httpClient = inject(HttpClient);

  // get all services/products of the same provider
  getBySppId(sppId: number): Observable<PriceListDto[]> {
    return this.httpClient.get<PriceListDto[]>(`${this.apiUrl}/${sppId}`);
  }

  update(id: number, price: number, discount: number): Observable<PriceListDto> {
    return this.httpClient.put<PriceListDto>(`${this.apiUrl}/${id}?price=${price}&discount=${discount}`, {});
  }

  downloadPdf(sppId: number): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/${sppId}/pdf`, { responseType: 'blob' });
  }
}
