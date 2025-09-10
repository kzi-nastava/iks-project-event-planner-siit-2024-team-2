import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../../model/communication/chat-message';
import { ChatMessageDto } from '../dtos/communication/chat-message.dto';

@Injectable({
  providedIn: 'root'
})
export class ChatMessageService {
  private apiUrl = `${environment.apiHost}api/chat-messages`;
  private httpClient = inject(HttpClient);

  sendMessage(message: ChatMessageDto): Observable<ChatMessage> {
    return this.httpClient.post<ChatMessage>(`${this.apiUrl}/send`, message);
  }

  add(chat: ChatMessageDto): Observable<ChatMessage> {
    return this.httpClient.post<ChatMessage>(this.apiUrl, chat);
  }
}
