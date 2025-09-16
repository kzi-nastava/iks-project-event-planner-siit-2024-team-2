import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../model/event/event';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MapComponent } from '../../shared/map/map.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { ReportDialogComponent } from '../../dialog/report-dialog/report-dialog.component';
import { ToastService } from '../../services/utils/toast-service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth-service.service';
import { PagedModel } from '../../shared/model/paged-model';
import { HttpErrorResponse } from '@angular/common/http';
import { ApprovedReviewCardComponent } from "../approved-review-card/approved-review-card.component";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { ReviewSummaryDto } from '../../dto/review/review-summary.dto';
import { ReviewDialogComponent, ReviewDialogData } from '../../dialog/review-dialog/review-dialog.component';
import { ReviewEligibilityDto } from '../../dto/review/review-eligibility.dto';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserContextService } from '../../services/utils/user-context.service';
import { userBlockedError } from '../../utils/error-utils';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MapComponent, MatIconModule, 
    MatMenuModule, MatMenuTrigger, ApprovedReviewCardComponent, MatPaginator, MatTooltipModule],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  eventId!: number;
  eventData?: Event;
  reviews: PagedModel<ReviewSummaryDto> | null = null;
  loading = true;
  error = '';
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;
  canReview: boolean | null = null;
  reason = "Not loaded";
  attending: boolean | null = null;

  // Injected
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly eventService = inject(EventService);
  readonly dialog = inject(MatDialog);
  readonly toastService = inject(ToastService);
  readonly userService = inject(UserService);
  readonly authService = inject(AuthService);
  readonly userContextService = inject(UserContextService);

  readonly isAdmin = this.authService.getUserRole() === 'ADMIN';
  readonly isLoggedIn = this.authService.isLoggedIn();

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const eventId = params['id'];
      if (eventId) {
        this.fetchEventData(eventId);
        this.fetchReviews(eventId);
        this.checkReviewEligibility(eventId);
        this.checkAttendance(eventId);
        this.eventId = Number(eventId);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private fetchEventData(eventId: number): void {
    this.eventService.getEvent(eventId).subscribe({
      next: (event) => {
        this.eventData = event;
        this.loading = false;
      },
      error: (err) => {
        if (userBlockedError(err)) {
          this.error = userBlockedError(err);
        } else
          this.error = 'Failed to load event details.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private fetchReviews(eventId: number): void {
    this.eventService.getReviews(eventId, { page: this.pageIndex, size: this.pageSize }).subscribe({
      next: (reviews: PagedModel<ReviewSummaryDto>) => {
        this.reviews = reviews;
        this.totalElements = reviews.page.totalElements;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  private checkReviewEligibility(eventId: number): void {
    this.eventService.getReviewEligibility(eventId).subscribe({
      next: (eligibility: ReviewEligibilityDto) => {
        this.canReview = eligibility.canReview;
        this.reason = eligibility.reason || "Can't review";
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  checkAttendance(eventId: number) {
    this.eventService.checkAttendance(eventId).subscribe({
      next: (attending) => {
        this.attending = attending;
      },
      error: (err) => {
        console.error('Failed to check attendance:', err);
      }
    });
  }

  openAgenda() {
    this.router.navigate(['/agenda'], { queryParams: { id: this.eventId, readonly: true } });
  }
  downloadPdf() {
    this.eventService.dowloadPdf(this.eventId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-${this.eventId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = 'Failed to download PDF.';
        console.error(err);
      }
    });
  }

  openReportDialog() {
    const email = this.eventData?.eventOrganizerDto?.email || '';
    const name = this.eventData?.eventOrganizerDto?.firstName || '' + ' ' + this.eventData?.eventOrganizerDto?.lastName || '';
    this.dialog.open(ReportDialogComponent, {data: {email: email, name: name}});
  }
  
  suspendUser() {
    const email = this.eventData?.eventOrganizerDto?.email || '';
    this.userService.suspendUser(email).subscribe({
      next: () => {
        this.toastService.show('User suspended successfully', 2000);
      },
      error: (err) => {
        console.error('Failed to suspend user:', err);
        this.toastService.show('Failed to suspend user', 2000);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    if (this.pageSize != event.pageSize)
      if (this.totalElements > this.pageIndex * event.pageSize) // enough elements for another page
        this.pageSize = event.pageSize;
    this.fetchReviews(this.eventId);
  }

  openReviewDialog() {
    const data: ReviewDialogData = {
      entityId: this.eventId,
      entityType: 'EVENT',
      entityName: this.eventData?.name || ''
    };
    this.dialog.open(ReviewDialogComponent, {data: data});
  }

  chat() {
    if (this.eventData?.eventOrganizerDto?.id) {
      this.userContextService.setUserId(this.eventData?.eventOrganizerDto?.id);
      this.router.navigate(['/chat']);
    }
  }

  attendEvent() {
    this.eventService.attendEvent(this.eventId).subscribe({
      next: () => {
        this.toastService.show('Successfully joined the event', 2000);
        this.attending = true;
        this.checkReviewEligibility(this.eventId);
      },
      error: (err) => {
        console.error('Failed to join event:', err);
        if (err.status == 409)
          this.toastService.show('Failed to join event, it\'s full', 2000);
        else
          this.toastService.show('Failed to join event', 2000);
      }
    });
  }

  cancelAttendance() {
    this.eventService.cancelAttendance(this.eventId).subscribe({
      next: () => {
        this.toastService.show('Successfully left the event', 2000);
        this.attending = false;
        this.checkReviewEligibility(this.eventId);
      },
      error: (err) => {
        console.error('Failed to leave event:', err);
        this.toastService.show('Failed to leave event', 2000);
      }
    });
  }
}
