import { Component, inject, model } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { HomeServiceProductFilterDialogParams } from '../../parameters/home-service-product-filter-dialog-params';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSliderModule } from '@angular/material/slider';
import {MatButtonToggleChange, MatButtonToggleModule} from '@angular/material/button-toggle';
import { ServiceProductDType } from '../../model/utils/service-product-dtype';
import { MatButtonModule } from '@angular/material/button';
import { ServiceProductCategory } from '../../model/service-product/service-product-category';
import { EventType } from '../../model/event/event-type';
import { MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions, MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-home-service-product-filter-dialog',
  standalone: true,
  providers: [
    {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: { clickAction: 'noop' } as MatCheckboxDefaultOptions}
  ],
  imports: [ReactiveFormsModule, MatSelectModule, MatInputModule, MatSliderModule, MatDialogModule, MatButtonToggleModule, MatButtonModule, MatCheckboxModule, FormsModule],
  templateUrl: './home-service-product-filter-dialog.component.html',
  styleUrl: './home-service-product-filter-dialog.component.css'
})
export class HomeServiceProductFilterDialogComponent {
  readonly dialog = inject(MatDialogRef<HomeServiceProductFilterDialogComponent>);
  readonly data = inject<HomeServiceProductFilterDialogParams>(MAT_DIALOG_DATA);

  serviceProductType = new FormControl<ServiceProductDType[]>([]);
  selectedDType: ServiceProductDType | undefined = ServiceProductDType.SERVICE

  categories = new FormControl<ServiceProductCategory[]>([]);
  allCategories: ServiceProductCategory[] = [];

  priceRange: number[] = [0, 1];
  disabledPriceSlider: boolean = true;

  eventTypes = new FormControl<EventType[]>([]);
  allEventTypes: EventType[] = [];
  
  durationRange: number[] = [0, 1];
  disabledDurationSlider: boolean = true;

  checked = false;
  indeterminate = true;

  constructor() {
  }

  ngOnInit(): void {
    // Setting possible values
    this.allEventTypes = this.data.filteringValues.availableEventTypes!;

    this.allCategories = this.data.filteringValues.categories!;

    this.priceRange = [Math.floor(this.data.filteringValues.minPrice!),
                       Math.ceil(this.data.filteringValues.maxPrice!)];
    if (this.priceRange.length == 0 || this.priceRange[0] == this.priceRange[1]) {
      this.priceRange = [0, 1];
      this.disabledPriceSlider = true;
      this.data.filter.minPrice = 0;
      this.data.filter.maxPrice = 1;
    } else
      this.disabledPriceSlider = false;
    if (this.data.filter.minPrice == undefined) {
      this.data.filter.minPrice = this.priceRange[0];
      this.data.filter.maxPrice = this.priceRange[1];
    }

    this.durationRange = [this.data.filteringValues.minDuration!, this.data.filteringValues.maxDuration!];
    if (this.durationRange.length == 0 || this.durationRange[0] == this.durationRange[1]) {
      this.durationRange = [0, 1];
      this.disabledDurationSlider = true;
      this.data.filter.minDuration = 0;
      this.data.filter.maxDuration = 1;
    } else
      this.disabledDurationSlider = false;
    if (this.data.filter.minDuration == undefined) {
      this.data.filter.minDuration = this.durationRange[0];
      this.data.filter.maxDuration = this.durationRange[1];
    }

    // // Loading previously set values

    if (this.data.filter.type == undefined)
      this.serviceProductType.setValue([]);
    else
      this.serviceProductType.setValue([this.data.filter.type]);
    this.selectedDType = this.data.filter.type;

    if (this.data.filter.categoryIds) 
      this.categories.setValue(this.data.selectedCategories);
    if (this.data.filter.availableEventTypeIds)
      this.categories.setValue(this.data.selectedCategories);

    switch (this.data.filter.automaticReserved) {
      case undefined:
        this.checked = false;
        this.indeterminate = true;
        break;
      case true:
        this.checked = true;
        this.indeterminate = false;
        break;
      case false:
        this.checked = false;
        this.indeterminate = false;
    }
  }

  applyFilter(): void {
    this.data.filter.type = this.selectedDType;

    if (this.categories.value && this.categories.value.length > 0){
      this.data.selectedCategories = this.categories.value;
      this.data.filter.categoryIds = this.categories.value.map(category => category.id);
    } else {
      this.data.selectedCategories = [];
      this.data.filter.categoryIds = undefined;
    }
    
    if (this.eventTypes.value && this.eventTypes.value.length > 0){
      this.data.selectedEventTypes = this.eventTypes.value;
      this.data.filter.availableEventTypeIds = this.eventTypes.value.map(type => type.id);
    } else {
      this.data.selectedEventTypes = [];
      this.data.filter.availableEventTypeIds = undefined;
    }

    if (this.disabledPriceSlider) {
      this.data.filter.minPrice = undefined;
      this.data.filter.maxPrice = undefined;
    }

    if (this.selectedDType == ServiceProductDType.SERVICE) {
      if (this.disabledDurationSlider) {
        this.data.filter.minDuration = undefined;
        this.data.filter.maxDuration = undefined;
      }
      if (this.checked)             // true false
        this.data.filter.automaticReserved = true;
      else if (this.indeterminate)  // false true
        this.data.filter.automaticReserved = undefined;
      else                          // false false
        this.data.filter.automaticReserved = false;
    } 
    else {
      this.data.filter.minDuration = undefined;
      this.data.filter.maxDuration = undefined;
      this.data.filter.automaticReserved = undefined;
    }

    this.dialog.close(this.data);
  }
  
  onTypeChanged(event: MatButtonToggleChange) {
    switch (event.value.length) {
      case 0:
        this.selectedDType = undefined;
        break;
      case 1:
        this.selectedDType = event.value[0];
        break;
      case 2:
        if (this.selectedDType == ServiceProductDType.PRODUCT)
          this.selectedDType = ServiceProductDType.SERVICE;
        else
          this.selectedDType = ServiceProductDType.PRODUCT;
        this.serviceProductType.setValue([this.selectedDType])
    }
    // if (this.selectedDType == ServiceProductDType.SERVICE)
    //   console.log("Enable options")
    // else
    //   console.log("Disable options")
  }
  
  formatPrice(value: number): string {
    return "€" + value;
  }
  
  formatDuration(value: number): string {
    return value + "h";
  }
  
  onCheckboxClick() {
    if (this.checked) {
      this.checked = false;
      this.indeterminate = false;
    } else if (this.indeterminate) {
      this.checked = true;
      this.indeterminate = false;  
    } else {
      this.checked = false;
      this.indeterminate = true;
    }
  }
}
