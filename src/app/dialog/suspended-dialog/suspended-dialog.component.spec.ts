import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuspendedDialogComponent, SuspendedDialogData } from './suspended-dialog.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

const mockData: SuspendedDialogData = {
    suspendedAt: new Date('2025-08-24T10:00:00Z')
  };

describe('SuspendedDialogComponent', () => {
  let component: SuspendedDialogComponent;
  let fixture: ComponentFixture<SuspendedDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuspendedDialogComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }]
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
