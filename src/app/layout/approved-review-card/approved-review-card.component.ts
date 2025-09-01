import { Component, Input } from '@angular/core';
import { MatCardHeader, MatCard, MatCardContent, MatCardTitleGroup, MatCardTitle, MatCardSubtitle } from "@angular/material/card";
import { MatMenuModule } from "@angular/material/menu";
import { ImgFallbackDirective } from "../../utils/image-fallback";
import { Review } from '../../model/review/review';
import { environment } from '../../../environments/environment';
import { MatIcon } from "@angular/material/icon";
import { intlFormatDistance } from 'date-fns';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-approved-review-card',
  standalone: true,
  imports: [
    MatCardHeader, MatCard, MatCardContent, MatCardTitleGroup, MatMenuModule, ImgFallbackDirective, MatCardTitle, MatCardSubtitle, MatIcon, MatButtonModule
  ],
  templateUrl: './approved-review-card.component.html',
  styleUrl: './approved-review-card.component.css'
})
export class ApprovedReviewCardComponent {
  @Input() review!: Review;

  getName(review: Review) {
    if (!review.user)
      return 'Deleted User';
    return review.user.firstName + ' ' + review.user.lastName;
  }

  getEmail(review: Review) {
    return review.user?.email || '';
  }

  getImagePath(review: Review) {
    if (!review?.user?.imageEncodedName)
      return 'images/avatar.svg';
    return environment.apiHost + "api/images/" + review.user?.imageEncodedName;
  }

  getStarIcons(grade: number) {
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
}
