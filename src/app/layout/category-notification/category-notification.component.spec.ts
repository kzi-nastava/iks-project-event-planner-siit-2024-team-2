import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryNotificationComponent } from './category-notification.component';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('CategoryNotificationComponent', () => {
  let component: CategoryNotificationComponent;
  let fixture: ComponentFixture<CategoryNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryNotificationComponent, SharedTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryNotificationComponent);
    component = fixture.componentInstance;
    component.message = '{"service":{"id":1,"name":"Test service","description":"Test description","serviceProductProviderId":1,"serviceProductCategoryId":1},"categoryName":"Test category","categoryDescription":"Test description"}';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
