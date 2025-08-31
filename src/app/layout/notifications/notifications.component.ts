import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../services/communication/notification.service';
import { SocketService } from '../../services/communication/socket.service';
import { PagedModel } from '../../shared/model/paged-model';
import { Notification } from '../../model/communication/notification';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { intlFormatDistance } from "date-fns";
import { combineLatest, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';
import { NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../../services/utils/toast-service';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { CategoryNotificationComponent } from "../category-notification/category-notification.component";
import { FormatUtilService } from '../../utils/format-util.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatExpansionModule, NgIf, MatPaginator, FormsModule, CategoryNotificationComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
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
export class NotificationsComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  notifications: Notification[] = [];
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;
  reloadPopup = false;
  newNotificationsPopup = false;
  newNotificationCount = 0;
  loadedTime: Date = new Date();

  // Injected
  readonly notificationService = inject(NotificationService);
  readonly socketService = inject(SocketService);
  readonly authService = inject(AuthService);
  readonly toastService = inject(ToastService);
  readonly formatUtilService = inject(FormatUtilService);

  ngOnInit(): void {
    this.loadedTime = new Date();
    this.fetchNotifications();
    setTimeout(() => {
      this.notificationService.resetBadgeCount();
    }, 0);
    combineLatest([this.socketService.initialized$, this.authService.isLoggedIn$])
      .pipe(takeUntil(this.destroy$))
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
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.newNotificationsPopup = true;
          this.newNotificationCount += 1;
      });
    }
  }

  fetchNotifications() {
    this.notificationService.getAllForCurrentUser({ page: this.pageIndex, size: this.pageSize }, this.loadedTime)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PagedModel<Notification>) => {
          this.notifications = JSON.parse(JSON.stringify(response.content));
          this.totalElements = response.page.totalElements;
          this.reloadPopup = false;
          for (const notification of this.notifications) {
            notification.formattedTitle = this.formatUtilService.formatAndSanitize(notification.title);
            notification.formattedMessage = this.formatUtilService.formatAndSanitize(notification.message);
          }
        },
        error: () => {
          this.toastService.show('Failed to load notifications');
        }
      });
  }

  dismiss(notification: Notification) {
    this.reloadPopup = true;
    notification.dismissing = true;
    setTimeout(() => {
      notification.dismissed = true;
    }, 0);
    this.totalElements--;
    this.notificationService.dismiss([notification.id])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          notification.dismissed = false;
          notification.dismissing = false;
          this.toastService.show('Failed to dismiss notification');
        }
      });
  }

  formatDate(date: Date) {
    return intlFormatDistance(date, Date.now(), {locale: 'en-US'});
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
    this.fetchNotifications();
  }

  goToFirstPage() {
    this.newNotificationsPopup = false;
    this.newNotificationCount = 0;
    this.pageIndex = 0;
    this.loadedTime = new Date();
    this.notificationService.resetBadgeCount();
    this.fetchNotifications();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
