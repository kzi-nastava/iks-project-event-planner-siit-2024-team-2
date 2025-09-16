import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from "@angular/material/card";
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceProductService } from '../../services/service-product/service-product.service';
import { ServiceService } from '../../services/service.service';
import { environment } from '../../../environments/environment';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../services/utils/toast-service';
import { AuthService } from '../../services/auth-service.service';
import { UserService } from '../../services/user/user.service';
import { Service } from '../../model/service-product/service';
import { ReportDialogComponent } from '../../dialog/report-dialog/report-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ServiceProduct } from '../../model/service-product/service-product';
import { HttpErrorResponse } from '@angular/common/http';
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { ApprovedReviewCardComponent } from "../approved-review-card/approved-review-card.component";
import { PagedModel } from '../../shared/model/paged-model';
import { ReviewSummaryDto } from '../../dto/review/review-summary.dto';
import { ReviewDialogComponent, ReviewDialogData } from '../../dialog/review-dialog/review-dialog.component';
import { ReviewEligibilityDto } from '../../dto/review/review-eligibility.dto';
import { MatTooltip } from "@angular/material/tooltip";
import { BookPurchaseDialogComponent } from '../../dialog/book-purchase-dialog/book-purchase-dialog-component';
import { OrderEligibilityDto } from '../../dto/budget/order-eligibility.dto';
import { userBlockedError } from '../../utils/error-utils';
import { UserContextService } from '../../services/utils/user-context.service';

@Component({
  selector: 'app-sp-details',
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, CommonModule,
    MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, MatPaginator, ApprovedReviewCardComponent, MatTooltip],
  templateUrl: './sp-details-component.html',
  styleUrl: './sp-details-component.css'
})
export class SpDetailsComponent  implements OnInit {
  spId!: number;
  spData?: Service;
  loading = true;
  error = '';
  isService = false;
  hasDuration = false;
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;
  reviews: PagedModel<ReviewSummaryDto> | null = null;
  canReview: boolean | null = null;
  canOrder: boolean | null = null;
  reason = "Not loaded";
  orderReason = "Not loaded";

  // Injected
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly serviceProductService = inject(ServiceProductService);
  readonly serviceService = inject(ServiceService);
  readonly toastService = inject(ToastService);
  readonly authService = inject(AuthService);
  readonly userService = inject(UserService);
  readonly dialog = inject(MatDialog);
  readonly userContextService = inject(UserContextService);

  readonly isAdmin = this.authService.getUserRole() === 'ADMIN';
  readonly isOrganizer = this.authService.getUserRole() === 'EVENT_ORGANIZER';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const spId = params['id'];
      if (spId) {
        this.fetchSpData(spId);
        this.fetchReviews(spId);
        this.checkOrderEligibility(spId);
        this.checkReviewEligibility(spId);
        this.spId = Number(spId);
      }
    });
  }

  private fetchSpData(spId: number): void {
    this.serviceProductService.get(spId).subscribe({
      next: (sp: ServiceProduct) => {
        this.loading = false;
        if (sp.dtype == 'Service') {
          this.serviceService.getService(spId).subscribe(serviceData => {
            this.spData = serviceData;
            this.isService = true;
            if ((this.spData.duration || 0) > 0) this.hasDuration = true; 
          })
        }
        else {
          this.spData = sp as Service;
          this.isService = false;
        }
      },
      error: (err: HttpErrorResponse) => {
        if (userBlockedError(err)) {
          this.error = userBlockedError(err);
        } else
          this.error = 'Failed to load service/product details.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  private fetchReviews(eventId: number): void {
    this.serviceProductService.getReviews(eventId, { page: this.pageIndex, size: this.pageSize }).subscribe({
      next: (reviews: PagedModel<ReviewSummaryDto>) => {
        this.reviews = reviews;
        this.totalElements = reviews.page.totalElements;
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  private checkOrderEligibility(eventId: number): void {
    this.serviceProductService.getOrderEligibility(eventId).subscribe({
      next: (eligibility: OrderEligibilityDto) => {
        this.canOrder = eligibility.canOrder;
        this.orderReason = eligibility.reason || (this.isService ? "Can't book" : "Can't buy");
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  private checkReviewEligibility(eventId: number): void {
    this.serviceProductService.getReviewEligibility(eventId).subscribe({
      next: (eligibility: ReviewEligibilityDto) => {
        this.canReview = eligibility.canReview;
        this.reason = eligibility.reason || "Can't review";
      },
      error: (err: HttpErrorResponse) => {
        console.error(err);
      }
    });
  }

  getImagePath(image: string): string {
    return environment.apiHost + 'api/images/' + image;
  }

  goToSpp(sppId: number) {
    this.router.navigate(['/profile'], { queryParams: { id: sppId }} );
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  buyBook() {
    this.dialog.open(BookPurchaseDialogComponent, {data: {sp: this.spData}});
  }

  openReportDialog() {
    const email = this.spData?.serviceProductProvider?.email || '';
    const name = this.spData?.serviceProductProvider?.firstName || '' + ' ' + this.spData?.serviceProductProvider?.lastName || '';
    this.dialog.open(ReportDialogComponent, {data: {email: email, name: name}});
  }
  
  suspendUser() {
    const email = this.spData?.serviceProductProvider?.email || '';
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
    this.fetchReviews(this.spId);
  }

  openReviewDialog() {
    const data: ReviewDialogData = {
      entityId: this.spId,
      entityType: 'SERVICE_PRODUCT',
      entityName: this.spData?.name || ''
    };
    this.dialog.open(ReviewDialogComponent, {data: data});
  }

  chat() {
    if (this.spData?.serviceProductProvider?.id) {
      this.userContextService.setUserId(this.spData?.serviceProductProvider?.id);
      this.router.navigate(['/chat']);
    }
  }
}
