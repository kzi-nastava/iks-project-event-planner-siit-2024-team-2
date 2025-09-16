import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserReport } from '../../model/user/user-report';
import { UserReportDto } from '../../dto/user/user-report.dto';
import { PageParams } from '../../parameters/page-params';
import { buildHttpParams } from '../../utils/http-utils';
import { PagedModel } from '../../shared/model/paged-model';

@Injectable({
  providedIn: 'root'
})
export class UserReportService {
  private apiUrl = `${environment.apiHost}api/user-reports`;
  httpClient = inject(HttpClient);

  getAll(): Observable<UserReport[]> {
    return this.httpClient.get<UserReport[]>(this.apiUrl);
  }
  get(id: number): Observable<UserReport> {
    return this.httpClient.get<UserReport>(`${this.apiUrl}/${id}`);
  }
  add(userReportDto: UserReportDto): Observable<UserReport> {
    return this.httpClient.post<UserReport>(this.apiUrl, userReportDto);
  }
  delete(id: number): Observable<boolean> {
    return this.httpClient.delete<boolean>(`${this.apiUrl}/${id}`);
  }
  approve(id: number): Observable<UserReport> {
    return this.httpClient.post<UserReport>(`${this.apiUrl}/${id}/approve`, {});
  }
  getAllNotApproved(pageParams: PageParams): Observable<PagedModel<UserReport>> {
    const params: HttpParams = buildHttpParams(pageParams);
    return this.httpClient.get<PagedModel<UserReport>>(`${this.apiUrl}/not-approved`, { params: params });
  }

}
