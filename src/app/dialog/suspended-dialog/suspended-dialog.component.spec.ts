import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendedDialogComponent } from './suspended-dialog.component';

describe('SuspendedDialogComponent', () => {
  let component: SuspendedDialogComponent;
  let fixture: ComponentFixture<SuspendedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuspendedDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SuspendedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
