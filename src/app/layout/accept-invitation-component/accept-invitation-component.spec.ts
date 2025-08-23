import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptInvitationComponent } from './accept-invitation-component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('AcceptInvitationComponent', () => {
  let component: AcceptInvitationComponent;
  let fixture: ComponentFixture<AcceptInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptInvitationComponent, SharedTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
