import { TestBed } from '@angular/core/testing';

import { ServiceProductCategoryService } from './service-product-category.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('ServiceProductCategoryService', () => {
  let service: ServiceProductCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
    });
    service = TestBed.inject(ServiceProductCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
