import { TestBed } from '@angular/core/testing';

import { UserService } from './user.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule]});
    service = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
