import { TestBed } from '@angular/core/testing';

import { ProfileService } from './profile.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('ProfileServiceService', () => {
  let service: ProfileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
    });
    service = TestBed.inject(ProfileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
