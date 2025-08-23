import { TestBed } from '@angular/core/testing';

import { InvitationService } from './invitation.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('InvitationService', () => {
  let service: InvitationService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule]})
    service = TestBed.inject(InvitationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
