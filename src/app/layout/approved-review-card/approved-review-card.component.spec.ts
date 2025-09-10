import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedReviewCardComponent } from './approved-review-card.component';

describe('ApprovedReviewCardComponent', () => {
  let component: ApprovedReviewCardComponent;
  let fixture: ComponentFixture<ApprovedReviewCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedReviewCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedReviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
