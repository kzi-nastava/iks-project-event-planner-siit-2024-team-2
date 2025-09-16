import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpDetailsComponent } from './sp-details-component';
import { SharedTestingModule } from '../../../../testing/shared-testing.module';

describe('SpDetailsComponent', () => {
  let component: SpDetailsComponent;
  let fixture: ComponentFixture<SpDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpDetailsComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
