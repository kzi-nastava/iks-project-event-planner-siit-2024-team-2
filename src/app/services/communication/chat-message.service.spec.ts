import { TestBed } from '@angular/core/testing';

import { ChatMessageService } from './chat-message.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('ChatMessageService', () => {
  let service: ChatMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule]});
    service = TestBed.inject(ChatMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
