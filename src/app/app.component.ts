import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { NavBarComponent } from "./layout/nav-bar/nav-bar.component";
import { combineLatestWith, Subscription } from 'rxjs';
import { AuthService } from './services/auth-service.service';
import { CommonModule } from '@angular/common';
import { SocketService } from './services/communication/socket.service';
import { fork } from 'child_process';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavBarComponent ,CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  authService = inject(AuthService);
  router = inject(Router);
  socketService = inject(SocketService);

  constructor() {}

  title = 'event-planner';
  isLoggedIn: boolean = false;
  ngOnInit(): void {
    this.socketService.initialize();
    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });

    this.socketService.initialized$.subscribe(status => {
      if (status) {
        this.socketService.openGlobalSocket();
      }
    });
    this.socketService.initialized$.pipe(
      combineLatestWith(this.authService.isLoggedIn$)
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
        .subscribe(message => {
          console.log(message);
      });
    }
  }

  private authSub!: Subscription;
}
