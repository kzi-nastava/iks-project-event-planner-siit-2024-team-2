import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule, FormControl } from '@angular/forms';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NewServiceComponent } from './new-service.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ServiceService } from '../../services/service-product/service.service';
import { NotificationService } from '../../services/communication/notification.service';
import { ImageService } from '../../services/service-product/image.service';


class MockServiceService {
  getService = jasmine.createSpy().and.returnValue(of({}));
  update = jasmine.createSpy().and.returnValue(of({ name: 'UpdatedService' }));
  add = jasmine.createSpy().and.returnValue(of({ name: 'NewService' }));
}

class MockEventTypeService {
  getAll = jasmine.createSpy().and.returnValue(of([{ id: 1, name: 'Wedding' }, { id: 2, name: 'Birthday' }]));
}

class MockCategoryService {
  getAll = jasmine.createSpy().and.returnValue(of([{ id: 1, name: 'Music' }]));
}

class MockNotificationService {
  sendCategoryRequest = jasmine.createSpy().and.returnValue(of(true));
}

class MockImageService {
  uploadImage = jasmine.createSpy().and.returnValue(of('aW1hZ2UuanBn')); // base64
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

describe('NewServiceComponent', () => {
  let component: NewServiceComponent;
  let fixture: ComponentFixture<NewServiceComponent>;
  let mockRouter: MockRouter;
  let mockNotificationService: MockNotificationService;
  let mockImageService: MockImageService;
  let mockService: MockServiceService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NewServiceComponent,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useValue: { queryParams: of({}) } },
        { provide: MockServiceService, useClass: MockServiceService },
        { provide: MockEventTypeService, useClass: MockEventTypeService },
        { provide: MockCategoryService, useClass: MockCategoryService },
        { provide: MockNotificationService, useClass: MockNotificationService },
        { provide: MockImageService, useClass: MockImageService },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NewServiceComponent);
    component = fixture.componentInstance;

    mockRouter = TestBed.inject(Router) as unknown as MockRouter;
    mockNotificationService = TestBed.inject(NotificationService) as unknown as MockNotificationService;
    mockImageService = TestBed.inject(ImageService) as unknown as MockImageService;
    mockService = TestBed.inject(ServiceService) as unknown as MockServiceService;

    fixture.detectChanges();
  });


  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should fail oneDurationRequiredValidator if all zero', () => {
    const group = component.newServiceForm.get('durationForm');
    if (!group) {
      fail('Duration form group not found');
      return;
    }
    group?.setValue({ duration: 0, minEngagementDuration: 0, maxEngagementDuration: 0 });
    expect(component.oneDurationRequiredValidator(group)).toEqual({ oneDurationRequiredValidator: true });
  });

  it('should pass oneCategoryRequiredValidator if newCategoryName and newCategoryDescription are set', () => {
    const group = component.newServiceForm.get('categoryForm');
    if (!group) {
      fail('Category form group not found');
      return;
    }
    group?.setValue({ category: null, newCategoryName: 'Name', newCategoryDescription: 'Desc' });
    expect(component.oneCategoryRequiredValidator(group)).toBeNull();
  });

  it('should initialize checkbox values and push into form array', () => {
    component.eventTypes = ['Wedding', 'Birthday'];
    component.eventTypeIds = [1, 2];
    component.initializeCheckboxValues(['Birthday']);
    expect(component.areEventTypesChecked).toEqual([false, true]);
    expect(component.selectedEvents.value).toContain(2);
  });

  it('should add event type id when checkbox is checked', () => {
    component.eventTypeIds = [1];
    const mockEvent = { target: { checked: true } } as unknown as Event;
    component.onCheckboxChange(mockEvent, 0);
    expect(component.selectedEvents.value).toContain(1);
  });

  it('should remove event type id when checkbox is unchecked', () => {
    component.eventTypeIds = [1];
    component.selectedEvents.push(new FormControl(1));
    const mockEvent = { target: { checked: false } } as unknown as Event;
    component.onCheckboxChange(mockEvent, 0);
    expect(component.selectedEvents.value).not.toContain(1);
  });

  it('should return correct service object from form', () => {
    localStorage.setItem('userId', '123');
    component.newServiceForm.patchValue({
      name: 'Test Service',
      description: 'Desc',
      specifies: 'Spec',
      price: 100
    });
    const result = component.recieveDataFromForm();
    expect(result.name).toBe('Test Service');
    expect(result.serviceProductProviderId).toBe(123);
  });

  it('should navigate to /home when no serviceId', () => {
    component.serviceId = undefined;
    component.onCancel();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should set formSubmitted = true if form invalid', () => {
    component.newServiceForm.get('name')?.setValue(''); // required
    component.images = []; // no images
    component.imageEncodedNames = [];
    component.onSubmit();
    expect(component.formSubmitted).toBeTrue();
  });
});
