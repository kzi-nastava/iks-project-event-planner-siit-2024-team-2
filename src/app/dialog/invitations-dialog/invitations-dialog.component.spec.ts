import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationItem, InvitationsDialogComponent } from './invitations-dialog.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('InvitationsDialogComponent', () => {
  let component: InvitationsDialogComponent;
  let fixture: ComponentFixture<InvitationsDialogComponent>;

  const mockData: InvitationItem[] = [
    { email: 'test@example.com', editable: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationsDialogComponent, SharedTestingModule],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: mockData }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
