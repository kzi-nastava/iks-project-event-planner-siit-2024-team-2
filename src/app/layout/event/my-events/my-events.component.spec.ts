import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventsComponent } from './my-events.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('MyEventsComponent', () => {
  let component: MyEventsComponent;
  let fixture: ComponentFixture<MyEventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEventsComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
