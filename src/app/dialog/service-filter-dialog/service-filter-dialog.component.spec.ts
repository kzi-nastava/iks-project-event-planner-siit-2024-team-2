import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFilterDialogComponent } from './service-filter-dialog.component';

describe('ServiceFilterDialogComponent', () => {
  let component: ServiceFilterDialogComponent;
  let fixture: ComponentFixture<ServiceFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceFilterDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
