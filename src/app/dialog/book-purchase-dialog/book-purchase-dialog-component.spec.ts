import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPurchaseDialogComponent } from './book-purchase-dialog-component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('BookReserveDialogComponent', () => {
  let component: BookPurchaseDialogComponent;
  let fixture: ComponentFixture<BookPurchaseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookPurchaseDialogComponent, SharedTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookPurchaseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
