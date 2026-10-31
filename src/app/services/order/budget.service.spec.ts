import { TestBed } from '@angular/core/testing';
import { BudgetService } from './budget.service';
import { SharedTestingModule } from '../../../testing/shared-testing.module';


describe('Budget', () => {
  let service: BudgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({imports: [SharedTestingModule]});
    service = TestBed.inject(BudgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
