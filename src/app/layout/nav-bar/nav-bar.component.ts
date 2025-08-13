import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth-service.service';
import { Subscription } from 'rxjs';

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
  private authSub!: Subscription;


  constructor(private authService: AuthService, private router: Router) {}

  hasRole(roles: string[]): boolean {
    const userRole = this.authService.getUserRole();
    return userRole ? roles.includes(userRole) : false;
  }

  ngOnInit(): void {
    this.authSub = this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
    });
  }

  ngOnDestroy(): void {
    this.authSub?.unsubscribe();
  }
  toggleSidenav() {
    this.toggle = !this.toggle;
  }
}
