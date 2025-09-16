import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedReviewCardComponent } from './approved-review-card.component';
import { SharedTestingModule } from '../../../../testing/shared-testing.module';

describe('ApprovedReviewCardComponent', () => {
  let component: ApprovedReviewCardComponent;
  let fixture: ComponentFixture<ApprovedReviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedReviewCardComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedReviewCardComponent);
    component = fixture.componentInstance;
    component.review = {
      creatorName: 'Test User',
      creatorEmail: 'test@user.com',
      creatorProfilePicture: 'test.jpg',
      comment: 'This is a comment',
      grade: 4,
      createdAt: new Date(),
      formattedComment: null
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
