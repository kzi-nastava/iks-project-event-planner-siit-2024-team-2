import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Message } from '../../model/message';
import { BehaviorSubject, map, Subject } from 'rxjs';

import * as Stomp from 'stompjs';
import SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private serverUrl = environment.apiHost + 'socket';
  private stompClient: any;
  private isInitialized = false;
  private isLoaded = false;
  private initializedSubject = new BehaviorSubject<boolean>(false);
  public initialized$ = this.initializedSubject.asObservable();
  private isLoadedSubject = new BehaviorSubject<boolean>(false);
  public isLoaded$ = this.isLoadedSubject.asObservable();

  private streams: { [dest: string]: Subject<Message> } = {};
  private subscriptions: string[] = [];
  private subscriptionRefs: { [dest: string]: any } = {};

  constructor(private http: HttpClient) {}

  initialize() {
    this.initializeConnection();
  }

  private initializeConnection() {
    const ws = new SockJS(this.serverUrl);
    this.stompClient = Stomp.over(ws);

    this.stompClient.connect({}, 
      () => {
        this.isLoaded = true;
        
        console.log(this.subscriptions);
        this.subscriptions.forEach(dest => {
          console.log("Subscribing to (initialize)", dest);
          this.stompClient.subscribe(dest, (message: { body: string }) =>
            this.handleMessage(message, dest)
          );
        });
        this.isLoadedSubject.next(true);
        if (!this.isInitialized) {
          this.isInitialized = true;
          this.initializedSubject.next(true);
        }
      },
      (error: any) => {
        console.error('Connection lost. Attempting to reconnect...', error);
        this.isLoaded = false;
        this.isLoadedSubject.next(false);
        setTimeout(() => {
          this.initializeConnection();
        }, 5000);
      }
    );
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
  openGlobalSocket() {
    this.subscribe('/socket-publisher');
  }

  // subscribe to private topic
  openPrivateSocket(userId: string) {
    this.subscribe(`/socket-publisher/${userId}`);
  }

  // Subribe with topic/subtopic/userId
  openSocket(topic: string = '', subtopic: string = '', userId: string = '') {
    this.subscribe(this.buildDestination(topic, subtopic, userId));
  }

  closeSocket(topic: string = '', subtopic: string = '', userId: string = '') {
    this.unsubscribe(this.buildDestination(topic, subtopic, userId));
  }

  private unsubscribe(dest: string) {
    if (this.isLoaded) {
      const ref = this.subscriptionRefs[dest];
      if (ref) {
        ref.unsubscribe();
        delete this.subscriptionRefs[dest];
      }
      this.subscriptions = this.subscriptions.filter(d => d !== dest);
    }
  }

  private buildDestination(topic: string, subtopic: string, userId: string) {
    let destination: string = '/socket-publisher';
    if (topic && subtopic) 
      destination += `/${topic}/${subtopic}`;
    else if (topic)
      destination += `/${topic}`;
    
    if (userId)
      destination += `/${userId}`;
    
    return destination;
  }

  private handleMessage(message: { body: string }, dest: string) {
    console.log("Handling message", message, dest);
    if (!message.body) return;
    const messageResult: Message = JSON.parse(message.body);

    const stream = this.streams[dest];
    if (stream) {
      stream.next(messageResult);
    }
  }
  
  private subscribe(dest: string) {
    if (!this.isLoaded) return;

    const ref = this.stompClient.subscribe(dest, (message: { body: string }) =>
      this.handleMessage(message, dest)
    );
    const oldRef = this.subscriptionRefs[dest];
    if (oldRef)
      oldRef.unsubscribe();
    this.subscriptionRefs[dest] = ref;
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
