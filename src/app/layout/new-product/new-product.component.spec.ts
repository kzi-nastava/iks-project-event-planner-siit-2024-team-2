import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductComponent } from './new-product.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('NewProductComponent', () => {
  let component: NewProductComponent;
  let fixture: ComponentFixture<NewProductComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewProductComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
