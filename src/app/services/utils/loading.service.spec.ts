import { TestBed } from '@angular/core/testing';

import { LoadingService } from './loading.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule]})
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
