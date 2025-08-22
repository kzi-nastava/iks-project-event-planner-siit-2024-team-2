import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.service';
import { SharedTestingModule } from '../../testing/shared-testing.module';

describe('ImageService', () => {
  let service: ImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
    });
    service = TestBed.inject(ImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
