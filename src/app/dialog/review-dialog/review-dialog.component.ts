import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { ReviewService } from '../../services/review/review.service';
import { ToastService } from '../../services/utils/toast-service';
import { AuthService } from '../../services/auth-service.service';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { ReviewDto } from '../../dto/review/review.dto';
import { ReviewType } from '../../dto/review/review-type';
import { MatIcon } from "@angular/material/icon";
import { MatInputModule } from '@angular/material/input';
import { validationSuffix } from '../../utils/error-utils';

export interface ReviewDialogData {
  entityId: number,
  entityType: ReviewType,
  entityName: string
}

@Component({
  selector: 'app-review-dialog',
  standalone: true,
  imports: [MatDialogContent, MatFormField, MatLabel, MatDialogActions, 
    MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatIcon, MatDialogModule, MatInputModule],
  templateUrl: './review-dialog.component.html',
  styleUrl: './review-dialog.component.css'
})
export class ReviewDialogComponent {
  commentFormControl = new FormControl('');

  grade = 5;
  previewGrade = -1;

  // Injected
  readonly data: ReviewDialogData = inject<ReviewDialogData>(MAT_DIALOG_DATA);
  readonly reviewService = inject(ReviewService);
  readonly dialogRef = inject(MatDialogRef);
  readonly toastService = inject(ToastService);
  readonly authService = inject(AuthService);

  readonly isLoggedIn = this.authService.isLoggedIn();

  onReview() {
    if (!this.commentFormControl.value) return;
    const reviewDto: ReviewDto = {
      grade: this.grade,
      comment: this.commentFormControl.value,
      entityId: this.data.entityId,
      reviewType: this.data.entityType
    }
    this.reviewService.add(reviewDto).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.toastService.show('Review submitted successfully', 2000);
      },
      error: (err) => {
        console.error('Failed to review:', err);
        this.dialogRef.close(false);
        this.toastService.show('Failed to submit review' + validationSuffix(err), 6000);
      }
    });
  }

  getStarIcons() {
    const grade = this.previewGrade > 0 ? this.previewGrade : this.grade;
    const icons = [];
    for (let i = 1; i <= grade; i++)
      icons.push('star');
    if (grade !== Math.floor(grade)) {
      icons.push('star_half');
    }
    for (let i = Math.ceil(grade) + 1; i <= 5; i++)
      icons.push('star_border');
    return icons.entries();
  }

  setRating(event: MouseEvent, index: number) {
    this.grade = this.getMouseValue(event, index);
  }

  setPreview(event: MouseEvent, index: number) {
    this.previewGrade = this.getMouseValue(event, index);
  }

  getMouseValue(event: MouseEvent, index: number) {
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const { left, width } = target.getBoundingClientRect();
    const clickX = event.clientX - left;
    const isHalf = clickX < width / 2;

    let value = index + (isHalf ? 0.5 : 1);
    if (value > 5) value = 5;
    if (value < 1) value = 1;
    return value;
  }
}
