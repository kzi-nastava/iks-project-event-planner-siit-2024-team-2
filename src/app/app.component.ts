import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavBarComponent } from "./layout/nav-bar/nav-bar.component";
import { combineLatestWith, Subject, takeUntil } from 'rxjs';
import { AuthService } from './services/auth-service.service';
import { CommonModule } from '@angular/common';
import { SocketService } from './services/communication/socket.service';
import { NotificationService } from './services/communication/notification.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavBarComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy, OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  socketService = inject(SocketService);
  notificationService = inject(NotificationService);

  private destroy$ = new Subject<void>();

  title = 'event-planner';
  isLoggedIn = false;
  ngOnInit(): void {
    this.socketService.initialize();
    this.authService.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        this.isLoggedIn = status;
      });

     this.socketService.initialized$
      .pipe(takeUntil(this.destroy$))
      .subscribe(status => {
        if (status) {
          this.socketService.openGlobalSocket();
        }
      });
    this.socketService.initialized$.pipe(
      combineLatestWith(this.authService.isLoggedIn$), takeUntil(this.destroy$),
    )
    .subscribe(([initialized, loggedIn]) => {
      if (initialized && loggedIn) {
        this.subscribeToNotifications();
      }
    });
  }

  private subscribeToNotifications() {
    if (this.authService.getUserId()){
      this.socketService.openSocket('notifications', '', this.authService.getUserId());
      this.socketService
        .getStream('notifications', '', this.authService.getUserId())
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.notificationService.increaseBadgeCount();
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
