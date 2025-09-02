import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PageParams } from '../../parameters/page-params';
import { Observable } from 'rxjs';
import { PagedModel } from '../../shared/model/paged-model';
import { Chat } from '../../model/communication/chat';
import { buildHttpParams } from '../../utils/http-utils';
import { ChatDto } from '../dtos/communication/chat.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = `${environment.apiHost}api/chat`;
  private httpClient = inject(HttpClient);

  add(chat: ChatDto): Observable<Chat> {
    return this.httpClient.post<Chat>(this.apiUrl, chat);
  }

  getAllMyChats(pageParams: PageParams): Observable<PagedModel<Chat>> {
    let params = buildHttpParams(pageParams);
    return this.httpClient.get<PagedModel<Chat>>(`${this.apiUrl}/mine`, { params: params });
  }

  getMineUser2Id(user2Id: number): Observable<Chat | null> {
    return this.httpClient.get<Chat | null>(`${this.apiUrl}/mine-and/${user2Id}`);
  }
}
