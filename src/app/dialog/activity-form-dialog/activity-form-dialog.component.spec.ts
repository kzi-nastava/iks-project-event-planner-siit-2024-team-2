import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFormDialogComponent } from './activity-form-dialog.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';
import { MatDialogRef } from '@angular/material/dialog';

describe('ActivityFormDialogComponent', () => {
  let component: ActivityFormDialogComponent;
  let fixture: ComponentFixture<ActivityFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityFormDialogComponent, SharedTestingModule],
      providers: [ActivityFormDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
