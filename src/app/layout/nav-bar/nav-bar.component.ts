import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth/auth-service.service';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from '../../services/communication/notification.service';
import { MatBadgeModule } from '@angular/material/badge';
import { LoadingService } from '../../services/utils/loading.service';
import { UserRole } from '../../dto/user/user-role';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatBadgeModule
],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
export class NavBarComponent implements OnInit, OnDestroy {
  toggle = false;
  isLoggedIn = false;
  isLoading = false;
  private authSub!: Subscription;
  private loadingSub!: Subscription;
  badgeCount$: Observable<number> | undefined;
  authButtonText: 'Sign in' | 'Sign out' = 'Sign in';
  canUpgrade = false;

  // Injected
  readonly authService = inject(AuthService);
  readonly router = inject(Router);
  readonly notificationService = inject(NotificationService);
  readonly loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.loading$;
  readonly cdRef = inject(ChangeDetectorRef);

  constructor() {
    this.badgeCount$ = this.notificationService.badgeCount$;
  }

  hasRole(roles: UserRole[]): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  clickAuthButton(): void {
    switch (this.authButtonText) {
      case 'Sign in':
        this.router.navigate(['/signin']);
        break;
      case 'Sign out':
        this.signOut();
        break;
    }
  }
  
  signOut() {
    this.authService.logout();
    this.router.navigate(['/signin']);
  }

  upgrade() {
    this.router.navigate(['/signup']);
  }

  ngOnInit(): void {
    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      this.authButtonText = this.isLoggedIn ? 'Sign out' : 'Sign in';
      this.canUpgrade = this.isLoggedIn && this.authService.getUserRole() === 'AUTHENTICATED';
    });
    this.loadingSub = this.loadingService.loading$.subscribe(status => {
      this.isLoading = status;
      this.cdRef.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
    this.loadingSub?.unsubscribe();
  }
  toggleSidenav() {
    this.toggle = !this.toggle;
  }
}
