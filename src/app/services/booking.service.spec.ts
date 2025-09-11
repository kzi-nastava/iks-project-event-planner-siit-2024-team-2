import { TestBed } from '@angular/core/testing';

import { BookingService } from './booking.service';
import { SharedTestingModule } from '../../testing/shared-testing.module';

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule]});
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
