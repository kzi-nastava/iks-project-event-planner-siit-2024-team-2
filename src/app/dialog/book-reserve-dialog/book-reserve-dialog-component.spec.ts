import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookReserveDialogComponent } from './book-reserve-dialog-component';

describe('BookReserveDialogComponent', () => {
  let component: BookReserveDialogComponent;
  let fixture: ComponentFixture<BookReserveDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookReserveDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookReserveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
