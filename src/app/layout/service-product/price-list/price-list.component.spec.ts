import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceListComponent } from './price-list.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('PriceListComponent', () => {
  let component: PriceListComponent;
  let fixture: ComponentFixture<PriceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceListComponent, SharedTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
