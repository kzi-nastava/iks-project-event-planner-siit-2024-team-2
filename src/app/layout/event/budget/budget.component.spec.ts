import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetComponent } from './budget.component';
import { SharedTestingModule } from '../../../../testing/shared-testing.module';

describe('BudgetComponent', () => {
  let component: BudgetComponent;
  let fixture: ComponentFixture<BudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BudgetComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
