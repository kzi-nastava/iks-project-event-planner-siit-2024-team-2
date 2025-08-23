import { TestBed } from '@angular/core/testing';

import { ServiceService } from './service.service';
import { SharedTestingModule } from '../../testing/shared-testing.module';

describe('ServiceService', () => {
  let service: ServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
    });
    service = TestBed.inject(ServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
