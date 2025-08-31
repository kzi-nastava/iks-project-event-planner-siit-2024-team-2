import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReviewsComponent } from './admin-reviews.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('AdminReviewsComponent', () => {
  let component: AdminReviewsComponent;
  let fixture: ComponentFixture<AdminReviewsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReviewsComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
