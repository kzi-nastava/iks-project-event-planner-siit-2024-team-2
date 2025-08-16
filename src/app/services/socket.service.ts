import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Message } from '../model/message';
import { map, Subject } from 'rxjs';

import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private serverUrl = environment.apiHost + 'socket';
  private stompClient: any;
  private isLoaded = false;

  public messages$ = new Subject<Message>();

  constructor(private http: HttpClient) {}

  initializeConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect({}, () => {
      this.isLoaded = true;
      this.openGlobalSocket();
    });
  }

  // send via WebSocket
  sendMessageUsingSocket(message: Message) {
    if (!this.isLoaded) return;
    this.stompClient.send(
      '/socket-subscriber/send/message',
      {},
      JSON.stringify(message)
    );
  }

  // send via REST API
  sendMessageUsingRest(message: Message) {
    return this.http.post<Message>(environment.apiHost + 'send-message-rest', message).pipe(
      map((data: Message) => data)
    );
  }

  // Subscribe to global topic
  private openGlobalSocket() {
    if (this.isLoaded) {
      this.stompClient.subscribe('/socket-publisher', (message: { body: string }) => {
        this.handleMessage(message, this.messages$);
      });
    }
  }

  // subscribe to private topic
  openPrivateSocket(userId: string) {
    if (this.isLoaded) {
      this.stompClient.subscribe(`/socket-publisher/${userId}`, (message: { body: string }) => {
        this.handleMessage(message, this.messages$);
      });
    }
  }

  private handleMessage(message: { body: string }, subject: Subject<Message>) {
    if (message.body) {
      const messageResult: Message = JSON.parse(message.body);
      subject.next(messageResult);
    }
  }
}
