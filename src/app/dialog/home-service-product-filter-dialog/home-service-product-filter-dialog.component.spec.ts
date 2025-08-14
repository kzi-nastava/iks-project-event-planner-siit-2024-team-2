import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeServiceProductFilterDialogComponent } from './home-service-product-filter-dialog.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('HomeServiceProductFilterDialogComponent', () => {
  let component: HomeServiceProductFilterDialogComponent;
  let fixture: ComponentFixture<HomeServiceProductFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeServiceProductFilterDialogComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeServiceProductFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
