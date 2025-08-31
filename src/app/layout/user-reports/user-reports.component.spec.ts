import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserReportsComponent } from './user-reports.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('UserReportsComponent', () => {
  let component: UserReportsComponent;
  let fixture: ComponentFixture<UserReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserReportsComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
