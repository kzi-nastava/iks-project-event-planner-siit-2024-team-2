import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationsDialogComponent } from './invitations-dialog.component';

describe('InvitationsDialogComponent', () => {
  let component: InvitationsDialogComponent;
  let fixture: ComponentFixture<InvitationsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationsDialogComponent]
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
