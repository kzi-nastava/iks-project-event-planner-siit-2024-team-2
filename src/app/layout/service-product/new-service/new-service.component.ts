import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ServiceService } from '../../../services/service-product/service.service';
import { ServiceProductCategoryService } from '../../../services/service-product/service-product-category.service';
import { EventTypeService } from '../../../services/event/event-type.service';
import { forkJoin } from 'rxjs';
import { ToastService } from '../../../services/utils/toast-service';
import { ImageService } from '../../../services/service-product/image.service';
import { NotificationDto } from '../../../dto/communication/notification.dto';
import { NotificationService } from '../../../services/communication/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Service } from '../../../model/service-product/service';
import { validationSuffix } from '../../../utils/error-utils';
import { environment } from '../../../../environments/environment';
import { ServiceProductCategory } from '../../../model/service-product/service-product-category';


@Component({
  selector: 'app-new-service',
  standalone: true,
  imports: [FormsModule, CommonModule, MatSelectModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSnackBarModule],
  templateUrl: './new-service.component.html',
  styleUrl: './new-service.component.css'
})
export class NewServiceComponent implements OnInit {
  // Injected
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly serviceService = inject(ServiceService);
  readonly SPCategoryService = inject(ServiceProductCategoryService);
  readonly eventTypeService = inject(EventTypeService);
  readonly toastService = inject(ToastService);
  readonly imageService = inject(ImageService); 
  readonly notificationService = inject(NotificationService);

  newServiceForm = new FormGroup({
      categoryForm: new FormGroup({
        category: new FormControl(),
        newCategoryName: new FormControl(''),
        newCategoryDescription: new FormControl(''),
      }, {validators: this.oneCategoryRequiredValidator}),
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      specifies: new FormControl('', [Validators.required]),
      price: new FormControl(0, [Validators.required, Validators.min(0)]),
      discount: new FormControl(0, [Validators.min(0)]),
      availableEventTypes: new FormArray([]),
      visible: new FormControl(false),
      available: new FormControl(false),
      automaticReserved: new FormControl(false),
      durationForm: new FormGroup({
        duration: new FormControl(0, [Validators.min(0)]),
        minEngagementDuration: new FormControl(0, [Validators.min(0)]),
        maxEngagementDuration: new FormControl(0, [Validators.min(0)]),
      }, {validators: this.oneDurationRequiredValidator}),
      reservationDaysDeadline: new FormControl(0, [Validators.required, Validators.min(0)]),
      cancellationDaysDeadline: new FormControl(0, [Validators.required, Validators.min(0)]),
    });

  oneDurationRequiredValidator(group: AbstractControl): ValidationErrors | null {
    const duration = group.get('duration')?.value;
    const minEngagement = group.get('minEngagementDuration')?.value;
    const maxEngagement = group.get('maxEngagementDuration')?.value;

    return (duration > 0 || (minEngagement > 0 && maxEngagement > 0)) ? null : { oneDurationRequiredValidator: true };
  }

  oneCategoryRequiredValidator(group: AbstractControl): ValidationErrors | null {
    const category = group.get('category')?.value;
    const newCategoryName = group.get('newCategoryName')?.value;
    const newCategoryDescription = group.get('newCategoryDescription')?.value;

    return (category || (newCategoryName && newCategoryDescription)) ? null : { oneCategoryRequiredValidator: true };
  }
  
  serviceCategories : ServiceProductCategory[] = [];
  eventTypes: string[] = [];
  eventTypeIds: number[] = [];
  areEventTypesChecked: boolean[] = []; // for initial check
  update = true; // is it update or create service mode
  serviceId? = -1;
  images: string[] = [];
  imageEncodedNames: string[] = [];
  categoryId = -1;


  ngOnInit(): void {
    // Get the service ID from query parameters
    this.route.queryParams.subscribe(params => {
      this.serviceId = params['id'];
      if (this.serviceId !== undefined) {
        this.fetchServiceData(); // Fetch the data based on the ID
        this.update = true;
      }
      else // in case of creating new service
      { // RELOAD THE PAGE, get ALL categories and clear checkboxes
        this.eventTypeService.getAll().subscribe(allEventTypes => {
          this.eventTypes = allEventTypes.map(t => t.name);
          this.eventTypeIds = allEventTypes.map(type => type.id)
        })
        this.SPCategoryService.getAll().subscribe(allCategories => {
          this.serviceCategories = allCategories;
        });
        this.initializeCheckboxValues([]);
        this.images = [];
        this.imageEncodedNames = [];
        this.newServiceForm.reset();
        this.update = false;
        this.newServiceForm.get('discount')?.setValue(0);
        this.newServiceForm.get('durationForm')?.get('duration')?.setValue(0);
        this.newServiceForm.get('durationForm')?.get('minEngagementDuration')?.setValue(0);
        this.newServiceForm.get('durationForm')?.get('maxEngagementDuration')?.setValue(0);
      }
    });
  }

  fetchServiceData(): void {
    forkJoin({
        allEventTypes: this.eventTypeService.getAll(),
        editingService: this.serviceService.getService(this.serviceId || -1)
      }).subscribe(({ allEventTypes, editingService }) => {
        this.eventTypes = allEventTypes.map(t => t.name);
        this.eventTypeIds = allEventTypes.map(t => t.id);
        if (editingService.category !== null)
          this.serviceCategories.push(editingService.category);
        this.initializeCheckboxValues(editingService.availableEventTypes?.map(type => type.name) || []);

        this.newServiceForm.patchValue({
          categoryForm: {
            category: editingService.category?.name,
          },
          name: editingService.name,
          description: editingService.description,
          specifies: editingService.specifies,
          price: editingService.price,
          discount: editingService.discount,
          visible: editingService.visible,
          available: editingService.available,
          automaticReserved: editingService.automaticReserved,
          durationForm: {
            duration: editingService.duration,
            minEngagementDuration: editingService.minEngagementDuration,
            maxEngagementDuration: editingService.maxEngagementDuration
          },
          reservationDaysDeadline: editingService.reservationDaysDeadline,
          cancellationDaysDeadline: editingService.cancellationDaysDeadline
      });
      this.images = editingService.images || [];
      this.imageEncodedNames = editingService.imageEncodedNames || [];
    },
    error => {
      console.error('Error fetching service data:', error);
    }
  );
}

  selectedEvents = this.newServiceForm.get('availableEventTypes') as FormArray;

  initializeCheckboxValues(availableEventTypes: string[]) {
    let i = 0;
    this.eventTypes.forEach(type => {
      if (availableEventTypes.includes(type)) {
        this.areEventTypesChecked[i] = true;
        this.selectedEvents.push(new FormControl(this.eventTypeIds[i]));
      }
      else
        this.areEventTypesChecked[i] = false;
      i++;
    })
  }

  onCheckboxChange(event: Event, typeIndex: number) {
    if ((event.target as HTMLInputElement).checked) {
      this.selectedEvents.push(new FormControl(this.eventTypeIds[typeIndex]));
    } else {
      const index = this.selectedEvents.controls.findIndex(ctrl => ctrl.value === this.eventTypeIds[typeIndex]);
      if (index !== -1) {
        this.selectedEvents.removeAt(index); 
      }
    }
  }

  formSubmitted = false;
  onSubmit() {
    if (this.newServiceForm.invalid || (this.images.length == 0 && this.imageEncodedNames.length == 0)) {
      this.formSubmitted = true;
      return;
    }
    if (!this.newServiceForm.get('categoryForm')?.get('category')?.value) {  // WAITING FOR ADMIN APPROVAL
      const service = this.recieveDataFromForm();
      const serviceMessage = {service: service, 
                      categoryName: this.newServiceForm.get('categoryForm')?.get('newCategoryName')?.value,
                      categoryDescription: this.newServiceForm.get('categoryForm')?.get('newCategoryDescription')?.value};
      
      const notification: NotificationDto = {
        title: "New category request",
        message: JSON.stringify(serviceMessage),
        seen: false,
        dismissed: false,
        userId: undefined
      };
      this.notificationService.sendCategoryRequest(notification).subscribe({
        next: () => {
          this.toastService.show('Waiting for creation approval', 2000);
          this.router.navigate(['/my-services']);
        },
        error: (err: HttpErrorResponse) => {
          console.error('Failed to create notification:', err);
          this.toastService.show('Failed to create!', 2000);
        }
      });
    }
    else {
      const observables = this.selectedImages.map((image:File) => this.imageService.uploadImage(image));
      forkJoin(observables)
        .subscribe({
          next: (response: string[]) => {
            const service = this.recieveDataFromForm();
            service.images = response.map(path => atob(path));
            this.toastService.show('Updating...', 2000);
            if (this.update) {  // UPDATING
              console.log(service)
              console.log("UPDATUJE SEE")
              this.serviceService.update(this.serviceId || -1, service).subscribe({
                next: (service: Service) => {
                  this.toastService.show('Service ' + service.name + ' updated successfully!', 2000);
                  this.router.navigate(['/my-services']);
                },
                error: (err: HttpErrorResponse) => {
                  console.error('Failed to update service:', err);
                  this.toastService.show('Failed to update service' + validationSuffix(err), 6000);
                }
              });
            }
            else {  // CREATING
              this.toastService.show('Creating...', 2000);
              console.log(service)
              this.serviceService.add(service).subscribe({
                next: (service: Service) => {
                  this.toastService.show('Service ' + service.name + ' created successfully!', 2000);
                  this.router.navigate(['/my-services']);
                },
                error: (err: HttpErrorResponse) => {
                  console.error('Failed to create service:', err);
                  this.toastService.show('Failed to create service' + validationSuffix(err), 6000);
                }
              });
            }
          },
          error: err => {
            console.error('Failed to upload images', err);
          }
        });
    }
  }

  recieveDataFromForm() {
    const service = {
      categoryId: this.newServiceForm.get('categoryForm')?.get('category')?.value,
      images: this.images,
      name: this.newServiceForm.get('name')?.value,
      description: this.newServiceForm.get('description')?.value,
      specifies: this.newServiceForm.get('specifies')?.value,
      price: this.newServiceForm.get('price')?.value,
      discount: this.newServiceForm.get('discount')?.value,
      availableEventTypeIds: this.selectedEvents.value,
      serviceProductProviderId: Number(localStorage.getItem('userId')),
      duration: this.newServiceForm.get('durationForm')?.get('duration')?.value,
      minEngagementDuration: this.newServiceForm.get('durationForm')?.get('minEngagementDuration')?.value,
      maxEngagementDuration: this.newServiceForm.get('durationForm')?.get('maxEngagementDuration')?.value,
      visible: this.newServiceForm.get('visible')?.value,
      available: this.newServiceForm.get('available')?.value,
      automaticReserved: this.newServiceForm.get('automaticReserved')?.value,
      reservationDaysDeadline: this.newServiceForm.get('reservationDaysDeadline')?.value,
      cancellationDaysDeadline: this.newServiceForm.get('cancellationDaysDeadline')?.value
    };
    return service;
  }

  onCancel(): void {
    if (this.serviceId !== undefined)
      this.router.navigate(['/my-services']); 
    else
      this.router.navigate(['/home']);
  }

  getImageUrl(path: string): string {
    return `${environment.apiHost}api/images/${path}`;
  }

  removeImage(index: number): void {
    this.imageEncodedNames.splice(index, 1);
    this.images.splice(index, 1);
    this.selectedImages.splice(index, 1);
  }

  removeImagePreview(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.images.splice(index, 1);
    this.selectedImages.splice(index, 1);
  }

  imagePreviews: string[] = [];
  selectedImages: File[] = [];

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files) return;

    Array.from(input.files).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreviews.push(reader.result as string);
        this.images.push(file.name);
        this.selectedImages.push(file);
      };
      reader.readAsDataURL(file); // creates base64 string
    });
  }
}