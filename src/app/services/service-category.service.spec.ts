import { TestBed } from '@angular/core/testing';

import { ServiceCategoryService } from './service-category.service';
import { SharedTestingModule } from '../../testing/shared-testing.module';

describe('ServiceCategoryService', () => {
  let service: ServiceCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
    });
    service = TestBed.inject(ServiceCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
