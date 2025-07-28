import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeServiceProductFilterDialogComponent } from './home-service-product-filter-dialog.component';

describe('HomeServiceProductFilterDialogComponent', () => {
  let component: HomeServiceProductFilterDialogComponent;
  let fixture: ComponentFixture<HomeServiceProductFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeServiceProductFilterDialogComponent]
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
