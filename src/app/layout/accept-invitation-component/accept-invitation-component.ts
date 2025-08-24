import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../services/utils/toast-service';
import { InvitationService } from '../../services/event/invitation.service';
import { Invitation } from '../../model/event/invitation';
import { AuthService } from '../../services/auth-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../services/utils/loading.service';
import { delay } from 'rxjs';

@Component({
  selector: 'app-accept-invitation-component',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './accept-invitation-component.html',
  styleUrl: './accept-invitation-component.css'
})
export class AcceptInvitationComponent {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly invitationService = inject(InvitationService);
  readonly toastService = inject(ToastService);
  readonly authService = inject(AuthService);
  readonly loadingService = inject(LoadingService);

  ngAfterViewInit(): void {
    this.loadingService.setLoading(true);
    requestAnimationFrame(() => { // Wait for the view to be rendered
      this.route.queryParams.subscribe(params => {
        const token = params['token'];
        if (!token) {
          this.router.navigate(['/home']);
          this.loadingService.setLoading(false);  
          return;
        }
        this.invitationService.acceptInvitation(token).subscribe({
          next: (invitation: Invitation) => {
            if (invitation.quickRegistration) {
              // TODO: Quick registration
              this.router.navigate(['/event-details'], { queryParams: { id: invitation.eventDto.id } });
              this.toastService.show('Quick registration is not implemented yet', 3000);
            } else if (this.authService.isLoggedIn()) {
              this.router.navigate(['/event-details'], { queryParams: { id: invitation.eventDto.id } });
              this.toastService.show('Successfully accepted invitation', 6000);
            }
            else // The invitation was already accepted
              this.router.navigate(['/home'], { queryParams: { token: null}, queryParamsHandling: 'merge' });
              
            this.loadingService.setLoading(false); 
          },
          error: (err: any) => {
            console.error('Failed to accept invitation:', err);
            
            if (err.status === 401) 
              this.router.navigate(['/signin'], { queryParams: { returnUrl: this.router.url }});
            else
              this.router.navigate(['/home'], { queryParams: { token: null}, queryParamsHandling: 'merge' });
            
            if (err.status === 409)
              this.toastService.show('Failed to accept invitation, event is full', 6000);
            else if (err.status === 401)
              this.toastService.show('Please sign in to accept invitation', 4000);
            else if (err.status === 403)
              this.toastService.show('This invitation is for another user', 6000);
            else
              this.toastService.show('Failed to accept invitation', 6000);
            
            this.loadingService.setLoading(false);  
          }
        });
      });
    });
  }
}
