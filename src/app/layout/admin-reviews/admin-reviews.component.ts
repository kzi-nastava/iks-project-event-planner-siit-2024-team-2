import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ServiceProductReview } from '../../model/service-product/service-product-review';
import { intlFormatDistance } from 'date-fns';
import { Subject, takeUntil } from 'rxjs';
import { PagedModel } from '../../shared/model/paged-model';
import { ToastService } from '../../services/utils/toast-service';
import { ReviewService } from '../../services/service-product/review.service';
import { MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardSubtitle, MatCardTitle } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-reviews',
  standalone: true,
  imports: [MatCard, MatCardHeader, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, MatPaginator, NgIf, MatButtonModule],
  templateUrl: './admin-reviews.component.html',
  styleUrl: './admin-reviews.component.css',
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
export class AdminReviewsComponent implements OnDestroy, OnInit {
  private readonly destroy$ = new Subject<void>();
  reviews: ServiceProductReview[] = [];
  totalElements = 0;
  pageIndex = 0;
  pageSize = 10;

  // Injected
  readonly reviewService = inject(ReviewService);
  readonly toastService = inject(ToastService);
  readonly router = inject(Router);
  readonly route = inject(ActivatedRoute);

  ngOnInit(): void {
    this.fetchReviews();
  }

  fetchReviews() {
    this.reviewService.getAllPending({ page: this.pageIndex, size: this.pageSize })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PagedModel<ServiceProductReview>) => {
          this.reviews = JSON.parse(JSON.stringify(response.content));
          this.totalElements = response.page.totalElements;
        },
        error: () => {
          this.toastService.show('Failed to suspend user');
        }
      });
  }

  reject(review: ServiceProductReview) {
    review.hiding = true;
    setTimeout(() => { // Allow animation to start
      review.hidden = true;
    }, 0);
    this.totalElements--;
    this.reviewService.delete(review.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          review.hidden = false;
          review.hiding = false;
          this.toastService.show('Failed to reject review');
        }
      });
  }

  approve(review: ServiceProductReview) {
    review.hiding = true;
    setTimeout(() => { // Allow animation to start
      review.hidden = true;
    }, 0);
    this.totalElements--;
    this.reviewService.approve(review.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: () => {
          review.hidden = false;
          review.hiding = false;
          this.toastService.show('Failed to approve review');
        }
      })
  }

  formatDate(date: Date) {
    return intlFormatDistance(date, Date.now(), {locale: 'en-US'});
  }

  getReviewer(review: ServiceProductReview) {
    const reviewerName = review?.user?.firstName
      ? review?.user?.firstName + ' ' + review?.user?.lastName
      : undefined;
    return reviewerName ? `${reviewerName} (${review?.user?.email})` : review?.user?.email;
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

  getServiceProductUrl(id: number) {
    return this.router.createUrlTree(['/sp-details'], { queryParams: { id: id } }).toString();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    if (this.pageSize != event.pageSize)
      if (this.totalElements > this.pageIndex * event.pageSize) // enough elements for another page
        this.pageSize = event.pageSize;
    this.fetchReviews();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

