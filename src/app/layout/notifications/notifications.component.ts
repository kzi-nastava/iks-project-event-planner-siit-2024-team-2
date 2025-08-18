import { Component, inject } from '@angular/core';
import { NotificationService } from '../../services/communication/notification.service';
import { SocketService } from '../../services/communication/socket.service';
import { PagedModel } from '../../shared/model/paged-model';
import { Notification } from '../../model/communication/notification';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { formatDistanceToNow, intlFormatDistance, set } from "date-fns";
import { combineLatest, combineLatestWith, Subject, take, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth-service.service';
import { NgIf } from '@angular/common';
import { animate, style, transition, trigger } from '@angular/animations';
import { ToastService } from '../../services/utils/toast-service';
import { MatPaginator, PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [],
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
export class NotificationsComponent {

}
