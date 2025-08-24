import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCategoryComponent } from './new-category.component';
import { S } from '@angular/cdk/keycodes';
import { SharedTestingModule } from '../../../testing/shared-testing.module';

describe('NewCategoryComponent', () => {
  let component: NewCategoryComponent;
  let fixture: ComponentFixture<NewCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCategoryComponent, SharedTestingModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
