import { TestBed } from '@angular/core/testing';

import { ChatService } from './chat.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule]});
    service = TestBed.inject(ChatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
