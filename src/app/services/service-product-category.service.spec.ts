import { TestBed } from '@angular/core/testing';

import { ServiceProductCategoryService } from './service-product-category.service';

describe('ServiceProductCategoryService', () => {
  let service: ServiceProductCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceProductCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
