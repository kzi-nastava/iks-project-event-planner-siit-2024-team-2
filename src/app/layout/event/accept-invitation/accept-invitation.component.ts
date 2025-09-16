import { Component, inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../../services/utils/toast-service';
import { InvitationService } from '../../../services/event/invitation.service';
import { Invitation } from '../../../model/event/invitation';
import { AuthService } from '../../../services/auth/auth-service.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingService } from '../../../services/utils/loading.service';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { InvitationErrorType } from '../../../dto/event/invitation-error-type';
import { InvitationErrorDto } from '../../../dto/event/invitation-error.dto';
import { SuspendedDialogComponent, SuspendedDialogData } from '../../../dialog/suspended-dialog/suspended-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-accept-invitation',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './accept-invitation.component.html',
  styleUrl: './accept-invitation.component.css'
})
export class AcceptInvitationComponent implements AfterViewInit {
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly invitationService = inject(InvitationService);
  readonly toastService = inject(ToastService);
  readonly authService = inject(AuthService);
  readonly loadingService = inject(LoadingService);
  readonly platformId = inject(PLATFORM_ID);
  readonly dialog = inject(MatDialog);

  ngAfterViewInit(): void {
    this.loadingService.setLoading(true);
    if (!isPlatformBrowser(this.platformId))
      return;

    requestAnimationFrame(() => { // Wait for the view to be rendered
      this.route.queryParams.subscribe(params => {
        const token = params['token'];
        if (!token) {
          this.router.navigate(['/home']);
          this.loadingService.setLoading(false);  
          return;
        }

        this.acceptInvitation(token);
      });
    });
  }

  private acceptInvitation(token: string) {
    this.invitationService.acceptInvitation(token).subscribe({
      next: (invitation: Invitation) => this.handleInvitation(token, invitation),
      error: (err: HttpErrorResponse) => this.handleError(err, token)
    });
  }

  private handleInvitation(token: string, invitation: Invitation) {
    if (invitation.quickRegistration)
      this.handleQuickRegistration(invitation, token);
    else if (this.authService.isLoggedIn()) {
      this.navigateToEvent(invitation.eventDto.id);
      this.toastService.show('Successfully accepted invitation', 6000, true);
    } else
      this.navigateToHome();
      
    this.loadingService.setLoading(false); 
  }

  private handleQuickRegistration(invitation: Invitation, token: string) {
    if (this.authService.isLoggedIn()) {
      this.navigateToEvent(invitation.eventDto.id);
      this.toastService.show('Successfully accepted invitation', 6000, true);
    } else
      this.quickLogin(token, invitation.eventDto.id, invitation.justRegistered, false);
  }

  private handleError(err: HttpErrorResponse, token: string) {
    console.error('Failed to accept invitation:', err);
    
    const errorDto: InvitationErrorDto = err.error as InvitationErrorDto;

    switch (errorDto.type) {
      case InvitationErrorType.UNAUTHORIZED_QUICK_REGISTRATION:
        this.quickLogin(token, errorDto.eventId, false, false);
        break;
      case InvitationErrorType.EVENT_FULL_QUICK_REGISTRATION:
        this.quickLogin(token, errorDto.eventId, false, true);
        break;
      case InvitationErrorType.UNAUTHORIZED:
        this.navigateToSignIn();
        this.toastService.show('Please sign in to accept invitation', 4000, true);
        break;
      case InvitationErrorType.EVENT_FULL:
        if (errorDto.eventId)
          this.navigateToEvent(errorDto.eventId);
        else
          this.navigateToHome();
        this.toastService.show('Failed to accept invitation, the event is full', 6000, true);
        break;
      case InvitationErrorType.FORBIDDEN:
        this.navigateToHome();
        this.toastService.show('This invitation is for another user', 6000, true);
        break;
      case InvitationErrorType.EVENT_NOT_FOUND:
        this.navigateToHome();
        this.toastService.show('Event could not be found', 6000, true);
        break;
      case InvitationErrorType.INVITATION_NOT_FOUND:
      default:
        this.navigateToHome();
        this.toastService.show('Invitation could not be found', 6000, true);
        break;
    }

    this.loadingService.setLoading(false);  
  }

  private quickLogin(token: string, eventId: number | null, justRegistered: boolean, isFull: boolean) {
    this.authService.quickLogin(token).subscribe({
      next: () => {
        if (eventId)
          this.navigateToEvent(eventId);
        else
          this.navigateToHome();
        if (justRegistered)
          this.toastService.show('Welcome! An account has been created for you, check your notifications for further instructions', 6000, true);
        else if (isFull)
          this.toastService.show('Failed to accept invitation, the event is full. You have been signed in', 6000, true);
        else
          window.location.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.navigateToHome();
        if (err?.error?.suspendedAt) {
          const data: SuspendedDialogData = {suspendedAt: new Date(err.error.suspendedAt)};
          this.dialog.open(SuspendedDialogComponent, {data: data});
        } else
          this.toastService.show('Failed to accept invitation', 6000, true)
      }
    });
  }

  private navigateToHome() {
    this.router.navigate(['/home'], { queryParams: { token: null }, queryParamsHandling: 'merge' });
  }
  private navigateToEvent(eventId: number | null) {
    if (eventId)
      this.router.navigate(['/event-details'], { queryParams: { id: eventId } });
    else
      this.navigateToHome();
  }  
  private navigateToSignIn() {
    this.router.navigate(['/signin'], { queryParams: { returnUrl: this.router.url }});
  }
}
