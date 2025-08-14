import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceFilterDialogComponent } from './service-filter-dialog.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('ServiceFilterDialogComponent', () => {
  let component: ServiceFilterDialogComponent;
  let fixture: ComponentFixture<ServiceFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceFilterDialogComponent, SharedTestingModule]
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
