import { TestBed } from '@angular/core/testing';

import { ProductService } from './product.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('ProductService', () => {
  let service: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedTestingModule],
    });
    service = TestBed.inject(ProductService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
