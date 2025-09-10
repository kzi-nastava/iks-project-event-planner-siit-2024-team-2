import { TestBed } from '@angular/core/testing';

import { ReviewService } from './review.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('ReviewService', () => {
  let service: ReviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule]});
    service = TestBed.inject(ReviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
