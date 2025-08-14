import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDialogComponent } from './filter-dialog.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';
import { MatDialogRef } from '@angular/material/dialog';

describe('FilterDialogComponent', () => {
  let component: FilterDialogComponent;
  let fixture: ComponentFixture<FilterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FilterDialogComponent, SharedTestingModule],
      providers: [MatDialogRef]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
