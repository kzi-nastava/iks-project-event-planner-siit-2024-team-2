import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { City } from '../../model/utils/city';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonService {
  readonly citiesJsonUrl = "json/cities.json"
  readonly httpClient = inject(HttpClient);

  getCities(): Observable<City[]> {
    return this.httpClient.get<City[]>(this.citiesJsonUrl);
  }
}
