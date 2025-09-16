import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { BookPurchaseDialogComponent } from './book-purchase-dialog-component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Service } from '../../model/service-product/service';
import { ToastService } from '../../services/utils/toast-service';
import { BudgetService } from '../../services/budget.service';
import { of, throwError } from 'rxjs';
import { BookingDto } from '../../dto/budget/booking.dto';
import { endOfDay, parse, startOfDay } from 'date-fns';

describe('BookPurchaseDialogComponent', () => {
  let component: BookPurchaseDialogComponent;
  let fixture: ComponentFixture<BookPurchaseDialogComponent>;
  let budgetService: jasmine.SpyObj<BudgetService>;
  let toastService: jasmine.SpyObj<ToastService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<BookPurchaseDialogComponent>>;
  const service: Service = 
  { 
    id: 1,
    name: 'Test Product',
    description: 'Test Product Description',
    category: { id: 1, name: 'Test Category', description: 'Test Category Description' },
    available: true,
    visible: true,
    price: 100,
    discount: 10,
    dtype: 'Service',
    automaticReserved: false,
    minEngagementDuration: 0,
    maxEngagementDuration: 24,
    duration: 3,
    reservationDaysDeadline: 5,
    cancellationDaysDeadline: 0,
    specifies: null,
    imageEncodedNames: null,
    availableEventTypes: null,
    serviceProductProvider: null,
    images: null
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    const toastSpy = jasmine.createSpyObj('ToastService', ['show']);
    const budgetSpy = jasmine.createSpyObj('BudgetService', ['getBudget', 'addNewBooking', 'addNewPurchase']);

    await TestBed.configureTestingModule({
      imports: [BookPurchaseDialogComponent, SharedTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: {sp: service} },
        { provide: MatDialogRef, useValue: dialogSpy },
        { provide: ToastService, useValue: toastSpy },
        { provide: BudgetService, useValue: budgetSpy }
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookPurchaseDialogComponent);
    component = fixture.componentInstance;
    budgetService = TestBed.inject(BudgetService) as jasmine.SpyObj<BudgetService>;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<BookPurchaseDialogComponent>>;

    component.budgets = [{
      id: 1,
      name: 'Test Budget',
      plannedSpending: 100,
      currentSpent: 0,
      serviceProductCategory: { id: 1, name: 'Test Category', description: 'Test Category Description' },
      bookings: [],
      purchases: []
    }];
    component.events = [{
      id: 1, 
      name: 'Test Event',
      description: 'Test Event Description',
      date: new Date().toISOString(),
      type: { id: 1, name: 'Test Type', description: 'Test Type Description', recommendedServiceProducts: [] },
      eventOrganizerDto: null,
      open: true,
      maxAttendances: 10,
      longitude: null,
      latitude: null,
      invitationEmails: null,
      budgets: component.budgets,
      activity: null
    }];

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });  

  it('should initialize form controls', () => {
    expect(component.selectedEvent).toBeDefined();
    expect(component.selectedBudget).toBeDefined();
    expect(component.selectedDate).toBeDefined();
    expect(component.selectedDuration).toBeDefined();
    expect(component.selectedTimeWindow).toBeDefined();
    expect(component.selectedTime).toBeDefined();
  });

  it('canConfirm() should return false if form invalid', () => {
    component.selectedEvent.setValue(-1);
    component.selectedBudget.setValue(-1);
    component.selectedDate.setValue(null);
    component.selectedDuration.setValue(0);
    component.selectedTimeWindow.setValue(null);
    component.selectedTime.setValue('');
    expect(component.canConfirm()).toBeFalse();
  });

  it('confirmBookingPurchase() should call addNewBooking when valid', fakeAsync(() => {
    component.selectedEvent.setValue(0);
    component.selectedBudget.setValue(100);
    component.selectedDate.setValue(new Date());
    component.selectedDuration.setValue(2);
    component.duration = 2;
    component.selectedTimeWindow.setValue(Date.now());
    component.selectedTime.setValue('10:00');
    const expectedDate = parse(component.selectedTime.value || '', 'HH:mm', component.selectedDate.value || new Date());

    budgetService.getBudget.and.returnValue(of(component.budgets[0]));
    budgetService.addNewBooking.and.returnValue(of({}));

    component.confirmBookingPurchase();
    tick();
    const bookingArg: BookingDto = budgetService.addNewBooking.calls.mostRecent().args[1];
    expect(bookingArg.duration).toBe(2);
    expect(bookingArg.date).toBe(expectedDate.toISOString());
    expect(bookingArg.price).toBe(component.totalPrice);
    expect(bookingArg.serviceId).toBe(component.spData.id);

    expect(budgetService.addNewBooking).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalled();
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  }));

  it('should show toast and not submit if budget exceeded', fakeAsync(() => {
    component.selectedBudget.setValue(100);
    component.totalPrice = 2000;
    budgetService.getBudget.and.returnValue(of(component.budgets[0]));

    component.confirmBookingPurchase();
    tick();

    expect(toastService.show).toHaveBeenCalledWith(jasmine.stringContaining("Your budget is only"), jasmine.any(Number));
    expect(budgetService.addNewBooking).not.toHaveBeenCalled();
  }));

  it('should handle error from addNewBooking', fakeAsync(() => {
    component.selectedEvent.setValue(0);
    component.selectedBudget.setValue(100);
    component.selectedDate.setValue(new Date());
    component.selectedDuration.setValue(2);
    component.duration = 2;
    component.selectedTimeWindow.setValue(Date.now());
    component.selectedTime.setValue('10:00');

    budgetService.getBudget.and.returnValue(of(component.budgets[0]));
    budgetService.addNewBooking.and.returnValue(throwError(() => ({ status: 500 })));

    component.confirmBookingPurchase();
    tick();

    expect(toastService.show).toHaveBeenCalled();
  }));

  it('onCancel() should close the dialog', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should not call addNewBooking if date or time missing', fakeAsync(() => {
    component.selectedBudget.setValue(100);
    component.duration = 2;

    budgetService.getBudget.and.returnValue(of(component.budgets[0]));

    component.selectedDate.setValue(null);
    component.selectedTime.setValue('');

    component.confirmBookingPurchase();
    tick();

    expect(budgetService.addNewBooking).not.toHaveBeenCalled();
  }));

  it('confirmBookingPurchase() should call addNewPurchase for Product', fakeAsync(() => {
    component.spData = { ...component.spData, dtype: 'Product' };
    component.selectedBudget.setValue(100);
    component.totalPrice = 50;

    budgetService.getBudget.and.returnValue(of(component.budgets[0]));
    budgetService.addNewPurchase.and.returnValue(of({}));

    component.confirmBookingPurchase();
    tick();

    expect(budgetService.addNewPurchase).toHaveBeenCalled();
    expect(toastService.show).toHaveBeenCalledWith(jasmine.stringContaining("Purchase"), jasmine.any(Number));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  }));

  it('should show "Booking added successfully" if automaticReserved', fakeAsync(() => {
    (component.spData as Service).automaticReserved = true;
    component.selectedBudget.setValue(100);
    component.selectedDate.setValue(new Date());
    component.selectedTime.setValue('10:00');
    component.duration = 2;
    component.selectedDuration.setValue(2);
    component.selectedTimeWindow.setValue(Date.now());

    budgetService.getBudget.and.returnValue(of(component.budgets[0]));
    budgetService.addNewBooking.and.returnValue(of({}));

    component.confirmBookingPurchase();
    tick();

    expect(toastService.show).toHaveBeenCalledWith(jasmine.stringContaining("added"), jasmine.any(Number));
    expect(dialogRef.close).toHaveBeenCalledWith(true);
  }));

  it('dateFilter() should return true if date is inside availableDates', () => {
    const today = startOfDay(new Date()).getTime();
    const tomorrow = endOfDay(new Date()).getTime();
    component.availableDates = [{ start: today, end: tomorrow }];
    
    const result = component.dateFilter(new Date());
    expect(result).toBeTrue();
  });

  it('dateFilter() should return false if date is outside availableDates', () => {
    component.availableDates = [];
    const result = component.dateFilter(new Date());
    expect(result).toBeFalse();
  });

  it('getTimeWindows() should return valid windows', () => {
    const today = new Date();
    component.selectedDate.setValue(today);
    component.duration = 2;
    const dayStart = startOfDay(today).getTime();
    const serviceStart = dayStart + 10 * 60 * 60 * 1000; // 10 hours from start of day
    const serviceEnd = serviceStart + 2 * 60 * 60 * 1000; // 2 hours after service start
    const end = endOfDay(today).getTime();
    component.availableDates = [{ start: dayStart, end: serviceStart }, { start: serviceEnd, end: end }];

    const windows = component.getTimeWindows();
    expect(windows.length).toEqual(2);
    expect(windows[0].start).toBeGreaterThanOrEqual(dayStart);
    expect(windows[0].end).toBeLessThanOrEqual(serviceStart);
    expect(windows[1].start).toBeGreaterThanOrEqual(serviceEnd);
    expect(windows[1].end).toBeLessThanOrEqual(end);
  });

  it('getTimeWindows() should return empty if duration missing', () => {
    component.selectedDate.setValue(new Date());
    component.duration = null;

    const windows = component.getTimeWindows();
    expect(windows).toEqual([]);
  });
});