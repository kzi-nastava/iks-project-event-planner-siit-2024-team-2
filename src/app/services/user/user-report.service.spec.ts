import { TestBed } from '@angular/core/testing';

import { UserReportService } from './user-report.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('UserReportService', () => {
  let service: UserReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule, SharedTestingModule]});
    service = TestBed.inject(UserReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
