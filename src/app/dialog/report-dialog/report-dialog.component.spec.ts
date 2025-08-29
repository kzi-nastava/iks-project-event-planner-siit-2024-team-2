import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDialogComponent } from './report-dialog.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('ReportDialogComponent', () => {
  let component: ReportDialogComponent;
  let fixture: ComponentFixture<ReportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportDialogComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
