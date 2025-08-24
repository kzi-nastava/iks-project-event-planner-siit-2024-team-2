import { TestBed } from '@angular/core/testing';

import { PriceListService } from './price-list.service';
import { SharedTestingModule } from '../../testing/shared-testing.module';

describe('PriceListService', () => {
  let service: PriceListService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule]});
    service = TestBed.inject(PriceListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
