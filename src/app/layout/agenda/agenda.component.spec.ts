import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaComponent } from './agenda.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('AgendaComponent', () => {
  let component: AgendaComponent;
  let fixture: ComponentFixture<AgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendaComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
