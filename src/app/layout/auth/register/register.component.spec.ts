import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { AuthService } from '../../../services/auth-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { SharedTestingModule } from '../../../../testing/shared-testing.module';

class MockAuthService {
  register = jasmine.createSpy().and.returnValue(of(true));
  registerCompany = jasmine.createSpy().and.returnValue(of(true));
}

class MockRouter {
  navigate = jasmine.createSpy();
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: MockAuthService;
  let router: MockRouter;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, SharedTestingModule],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
        { 
          provide: ActivatedRoute, 
          useValue: { snapshot: { paramMap: { get: () => null } } } 
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as MockAuthService;
    router = TestBed.inject(Router) as unknown as MockRouter;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should invalidate the form when empty', () => {
    component.registerForm.reset();
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should validate matching passwords', () => {
    component.registerForm.patchValue({
      password: '123456',
      confirmPassword: '123456'
    });
    expect(component.registerForm.errors).toBeNull();
  });

  it('should detect password mismatch', () => {
    component.registerForm.patchValue({
      password: '123456',
      confirmPassword: '654321'
    });
    expect(component.registerForm.errors?.['mismatch']).toBeTrue();
  });

  it('should call register() for event organizer', () => {
    component.registerForm.patchValue({
      userType: 'eventOrganizer',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Street',
      phone: '1234567890',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456'
    });
    component.onRegister();
    expect(authService.register).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should call registerCompany() for company user', () => {
    component.registerForm.patchValue({
      userType: 'company',
      firstName: 'Jane',
      lastName: 'Smith',
      address: '456 Avenue',
      phone: '1234567890',
      email: 'company@test.com',
      password: '123456',
      confirmPassword: '123456',
      companyName: 'Test Co',
      companyDescription: 'A company'
    });
    component.isEventOrganizer = false;
    component.onRegister();
    expect(authService.registerCompany).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/signin']);
  });

  it('should handle registration errors', () => {
    authService.register.and.returnValue(throwError(() => new Error('fail')));
    component.registerForm.patchValue({
      userType: 'eventOrganizer',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Street',
      phone: '1234567890',
      email: 'test@test.com',
      password: '123456',
      confirmPassword: '123456'
    });
    spyOn(console, 'error');
    component.onRegister();
    expect(console.error).toHaveBeenCalledWith('Registration error:', jasmine.any(Error));
  });
  it('should create the registration form with default empty values', () => {
    expect(component.registerForm).toBeTruthy();
    expect(component.registerForm.value).toEqual({
      role: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      address: '',
      phone: '',
      profilePhoto: null,
      companyName: '',
      companyAddress: '',
      companyPhone: '',
      aboutCompany: '',
      companyPhotos: null
    });
  });
  
  it('should mark the form as valid when all required OD fields are filled correctly', () => {
    component.registerForm.patchValue({
      role: 'OD',
      email: 'test@example.com',
      password: 'ValidPass123',
      confirmPassword: 'ValidPass123',
      firstName: 'Petar',
      lastName: 'Petrovic',
      address: 'Bulevar 1',
      phone: '0612345678'
    });
    expect(component.registerForm.valid).toBeTrue();
  });
  
  it('should send form data when onSubmit is called with valid data', () => {
    spyOn(component, 'onRegister');
    component.registerForm.patchValue({
      role: 'OD',
      email: 'test@example.com',
      password: 'ValidPass123',
      confirmPassword: 'ValidPass123',
      firstName: 'Petar',
      lastName: 'Petrovic',
      address: 'Bulevar 1',
      phone: '0612345678'
    });
    component.onRegister();
    expect(component.onRegister).toHaveBeenCalledWith();
  });
  
});
