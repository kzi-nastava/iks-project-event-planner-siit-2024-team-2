import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventTypeComponent } from '../new-event-type/new-event-type.component';
import { SharedTestingModule } from '../../../../testing/shared-testing.module';

describe('NewEventTypeComponent', () => {
  let component: NewEventTypeComponent;
  let fixture: ComponentFixture<NewEventTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEventTypeComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEventTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
