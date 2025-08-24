import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyEventTypesComponent } from './my-event-types.component';

describe('MyEventTypesComponent', () => {
  let component: MyEventTypesComponent;
  let fixture: ComponentFixture<MyEventTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyEventTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyEventTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
