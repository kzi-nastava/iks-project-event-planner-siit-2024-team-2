import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from "@angular/material/card";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { Subject, takeUntil } from 'rxjs';
import { UserReportService } from '../../../services/user/user-report.service';
import { ToastService } from '../../../services/utils/toast-service';
import { UserReport } from '../../../model/user/user-report';
import { PagedModel } from '../../../shared/model/paged-model';
import { intlFormatDistance } from 'date-fns';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-reports',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatPaginator, NgIf, MatButtonModule],
  templateUrl: './user-reports.component.html',
  styleUrl: './user-reports.component.css',
    animations: [
      trigger('fadeOut', [
        transition(':leave', [
          style({
            opacity: 1,
            height: '*',
          }),
          animate('300ms ease-out', style({
            opacity: 0,
            height: '0px',
          }))
        ])
      ])
    ]
})
export class UserReportsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();
  userReports: UserReport[] = [];
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;

  // Injected
  readonly userReportService = inject(UserReportService);
  readonly toastService = inject(ToastService);

  ngOnInit(): void {
    this.fetchUserReports();
  }

  fetchUserReports() {
    this.userReportService.getAllNotApproved({ page: this.pageIndex, size: this.pageSize })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PagedModel<UserReport>) => {
          this.userReports = JSON.parse(JSON.stringify(response.content));
          this.totalElements = response.page.totalElements;
        },
        error: () => {
          this.toastService.show('Failed to suspend user');
        }
      });
  }

  deny(userReport: UserReport) {
    userReport.hiding = true;
    setTimeout(() => { // Allow animation to start
      userReport.hidden = true;
    }, 0);
    this.totalElements--;
    this.userReportService.delete(userReport.id || 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          userReport.hidden = false;
          userReport.hiding = false;
          this.toastService.show('Failed to deny user report');
        }
      });
  }

  approve(userReport: UserReport) {
    userReport.hiding = true;
    setTimeout(() => { // Allow animation to start
      userReport.hidden = true;
    }, 0);
    this.totalElements--;
    this.userReportService.approve(userReport.id || 0)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          userReport.hidden = false;
          userReport.hiding = false;
          this.toastService.show('Failed to approve user report');
        }
      })
  }

  formatDate(date: Date) {
    return intlFormatDistance(date, Date.now(), {locale: 'en-US'});
  }

  getReporter(userReport: UserReport) {
    const reporterName = userReport?.reporter?.firstName 
      ? userReport?.reporter?.firstName + ' ' + userReport?.reporter?.lastName
      : undefined;
    return reporterName ? `${reporterName} (${userReport?.reporter?.email})` : userReport?.reporter?.email;
  }

  getReported(userReport: UserReport) {
    const reportedName = userReport?.reported?.firstName 
      ? userReport?.reported?.firstName + ' ' + userReport?.reported?.lastName
      : undefined;
    return reportedName ? `${reportedName} (${userReport?.reported?.email})` : userReport?.reported?.email;
  }

  isEllipsisActive(element: HTMLElement): boolean {
    return element.offsetHeight < element.scrollHeight;
  }

  readMore(element: HTMLElement): void {
    element.classList.remove('collapsed');
    element.classList.add('expanded');
  }

  readLess(element: HTMLElement): void {
    element.classList.remove('expanded');
    element.classList.add('collapsed');
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    if (this.pageSize != event.pageSize)
      if (this.totalElements > this.pageIndex * event.pageSize) // enough elements for another page
        this.pageSize = event.pageSize;
    this.fetchUserReports();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
