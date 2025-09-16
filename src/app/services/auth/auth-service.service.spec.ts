import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth-service.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('AuthServiceService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule],
      providers: [AuthService]});
    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
