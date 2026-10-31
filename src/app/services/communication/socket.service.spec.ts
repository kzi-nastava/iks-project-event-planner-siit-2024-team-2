import { TestBed } from '@angular/core/testing';

import { SocketService } from './socket.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('ServiceService', () => {
  let service: SocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule]});
    service = TestBed.inject(SocketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
