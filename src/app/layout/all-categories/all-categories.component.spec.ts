import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCategoriesComponent } from './all-categories.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('AllCategoriesComponent', () => {
  let component: AllCategoriesComponent;
  let fixture: ComponentFixture<AllCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllCategoriesComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
