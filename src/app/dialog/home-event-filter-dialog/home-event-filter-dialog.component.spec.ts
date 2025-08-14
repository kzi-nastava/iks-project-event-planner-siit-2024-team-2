import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeEventFilterDialogComponent } from './home-event-filter-dialog.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('HomeEventFilterDialogComponent', () => {
  let component: HomeEventFilterDialogComponent;
  let fixture: ComponentFixture<HomeEventFilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeEventFilterDialogComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeEventFilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
