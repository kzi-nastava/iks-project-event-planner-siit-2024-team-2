import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface SearchResult {
  lat: number;
  lon: number;
}

@Injectable({
  providedIn: 'root',
})
export class MapService {
  private http = inject(HttpClient);


  search(street: string): Observable<Partial<SearchResult>[]> {
    return this.http.get<Partial<SearchResult>[]>(
      'https://nominatim.openstreetmap.org/search?format=json&q=' + street
    );
  }

  reverseSearch(lat: number, lon: number): Observable<Partial<SearchResult>> {
    return this.http.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&<params>`
    );
  }
}
