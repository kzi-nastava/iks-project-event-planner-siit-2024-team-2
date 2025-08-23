import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewEventComponent } from './new-event.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('CreateEventComponent', () => {
  let component: NewEventComponent;
  let fixture: ComponentFixture<NewEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewEventComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
