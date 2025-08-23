import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth-service.service';
import { Observable, Subscription } from 'rxjs';
import { NotificationService } from '../../services/communication/notification.service';
import { MatBadgeModule } from '@angular/material/badge';
import { LoadingService } from '../../services/utils/loading.service';

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
export class NavBarComponent {
  signOut() {
    this.authService.logout();
     this.router.navigate(['/signin']);
  }
  toggle: boolean = false;
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  private authSub!: Subscription;
  private loadingSub!: Subscription;
  badgeCount$: Observable<number> | undefined;

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

  hasRole(roles: string[]): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
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
