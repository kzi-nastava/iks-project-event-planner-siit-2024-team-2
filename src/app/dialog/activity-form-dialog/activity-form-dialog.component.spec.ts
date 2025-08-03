import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityFormDialogComponent } from './activity-form-dialog.component';

describe('ActivityFormDialogComponent', () => {
  let component: ActivityFormDialogComponent;
  let fixture: ComponentFixture<ActivityFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActivityFormDialogComponent]
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
