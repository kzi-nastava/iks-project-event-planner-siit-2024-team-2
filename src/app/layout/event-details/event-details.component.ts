import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../model/event/event';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MapComponent } from '../../shared/map/map.component';
import { MatIconModule } from '@angular/material/icon';
import { MatMenu, MatMenuModule, MatMenuTrigger } from "@angular/material/menu";
import { ReportDialogComponent } from '../../dialog/report-dialog/report-dialog.component';
import { ToastService } from '../../services/utils/toast-service';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../services/user/user.service';
import { AuthService } from '../../services/auth-service.service';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MapComponent, MatIconModule, MatMenuModule, MatMenuTrigger],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  eventId!: number;
  eventData?: Event;
  loading = true;
  error = '';

  // Injected
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly eventService = inject(EventService);
  readonly dialog = inject(MatDialog);
  readonly toastService = inject(ToastService);
  readonly userService = inject(UserService);
  readonly authService = inject(AuthService);

  readonly isAdmin = this.authService.getUserRole() === 'ADMIN';

  constructor() {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const eventId = params['id'];
      if (eventId) {
        this.fetchEventData(eventId);
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
        this.error = 'Failed to load event details.';
        this.loading = false;
        console.error(err);
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
    const dialogRef = this.dialog.open(ReportDialogComponent, {data: {email: email, name: name}});
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
}
