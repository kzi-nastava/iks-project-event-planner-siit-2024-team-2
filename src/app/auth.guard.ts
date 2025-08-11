import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from './services/auth-service.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRoles = route.data['roles'] as string[];
    const userRole = this.authService.getUserRole();
    if (this.authService.isLoggedIn() && userRole && expectedRoles.includes(userRole)) {
      return true;
    } else {
      this.router.navigate(['/signin']);
      return false;
    }
  }
}
