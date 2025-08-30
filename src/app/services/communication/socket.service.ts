import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Message } from '../../model/communication/message';
import { BehaviorSubject, map, Subject } from 'rxjs';

import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private serverUrl = environment.apiHost + 'socket';
  private stompClient: Client;
  private isInitialized = false;
  private isLoaded = false;
  private initializedSubject = new BehaviorSubject<boolean>(false);
  public initialized$ = this.initializedSubject.asObservable();
  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  public isLoaded$ = this.isLoadedSubject.asObservable();

  private streams: Record<string, Subject<Message>> = {};
  private subscriptions: string[] = [];
  private subscriptionRefs: Record<string, StompSubscription> = {};

  readonly http = inject(HttpClient);

  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS(this.serverUrl),
      reconnectDelay: 20000,
      debug: (msg: string) => console.log(msg),
    });

    this.stompClient.onConnect = () => {
      this.isLoaded = true;

      Object.keys(this.subscriptionRefs).forEach(dest => {
        this.subscriptionRefs[dest].unsubscribe();
        delete this.subscriptionRefs[dest];
      });
      this.subscriptions.forEach(dest => {
        const ref = this.stompClient.subscribe(dest, (message: IMessage) =>
          this.handleMessage(message, dest)
        );
        this.subscriptionRefs[dest] = ref;
      });

      this.isLoadedSubject.next(true);
      if (!this.isInitialized) {
        this.isInitialized = true;
        this.initializedSubject.next(true);
      }
    };

    this.stompClient.onDisconnect = () => {
      this.isLoaded = false;
      this.isLoadedSubject.next(false);
      this.isInitialized = false;
    };
  }

  initialize() {
    if (!this.stompClient.active)
      this.stompClient.activate();
  }

  // send via WebSocket
  sendMessageUsingSocket(message: Message) {
    if (!this.isLoaded) return;
    this.stompClient.publish({
      destination: '/socket-subscriber/send/message',
      body: JSON.stringify(message)
    });
  }

  // send via REST API
  sendMessageUsingRest(message: Message) {
    return this.http
      .post<Message>(environment.apiHost + 'send-message-rest', message)
      .pipe(map((data: Message) => data));
  }

  // Subscribe to global topic
  openGlobalSocket() {
    this.subscribe('/socket-publisher');
  }

  // subscribe to private topic
  openPrivateSocket(userId: string) {
    this.subscribe(`/socket-publisher/${userId}`);
  }

  // Subribe with topic/subtopic/userId
  openSocket(topic = '', subtopic = '', userId = '') {
    this.subscribe(this.buildDestination(topic, subtopic, userId));
  }

  closeSocket(topic = '', subtopic = '', userId = '') {
    this.unsubscribe(this.buildDestination(topic, subtopic, userId));
  }

  private unsubscribe(dest: string) {
    const ref = this.subscriptionRefs[dest];
    if (ref) {
      ref.unsubscribe();
      delete this.subscriptionRefs[dest];
    }
    this.subscriptions = this.subscriptions.filter(d => d !== dest);
  }

  private buildDestination(topic: string, subtopic: string, userId: string) {
    let destination = '/socket-publisher';
    if (topic && subtopic) 
      destination += `/${topic}/${subtopic}`;
    else if (topic)
      destination += `/${topic}`;
    
    if (userId)
      destination += `/${userId}`;
    
    return destination;
  }

  private handleMessage(message: IMessage, dest: string) {
    if (!message.body) return;
    const messageResult: Message = JSON.parse(message.body);

    const stream = this.streams[dest];
    if (stream) {
      stream.next(messageResult);
    }
  }
  
  private subscribe(dest: string) {
    if (!this.isLoaded) return;

    if (!this.subscriptionRefs[dest]) {
      const ref = this.stompClient.subscribe(dest, (message: IMessage) =>
        this.handleMessage(message, dest)
      );
      this.subscriptionRefs[dest] = ref;
    }
    if (!this.subscriptions.includes(dest)) {
      this.subscriptions.push(dest);
    }
  }

  getStream(topic: string, subtopic: string, userId: string) {
    const dest = this.buildDestination(topic, subtopic, userId);
    if (!this.streams[dest]) {
      this.streams[dest] = new Subject<Message>();
    }
    return this.streams[dest];
  }
}
