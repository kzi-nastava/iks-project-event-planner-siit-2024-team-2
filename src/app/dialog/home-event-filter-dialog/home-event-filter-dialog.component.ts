import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeEventFilterDialogParams } from '../../parameters/home-event-filter-dialog-params';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from "@angular/material/divider";
import { EventType } from '../../model/event/event-type';
import {MatSliderModule} from '@angular/material/slider';
import { City } from '../../model/utils/city';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home-event-filter-dialog',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [MatDialogModule, MatFormFieldModule, MatButtonModule, MatInputModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatDividerModule, MatSliderModule, MatDatepickerModule, MatIconModule],
  templateUrl: './home-event-filter-dialog.component.html',
  styleUrl: './home-event-filter-dialog.component.css'
})
export class HomeEventFilterDialogComponent {
  readonly dialog = inject(MatDialogRef<HomeEventFilterDialogComponent>);
  readonly data = inject<HomeEventFilterDialogParams>(MAT_DIALOG_DATA);

  eventTypes = new FormControl<EventType[]>([]);
  allEventTypes: EventType[] = [];
  
  fullMaxAttendancesRange: number[] = [0, 1];
  disabledAttendancesSlider: boolean = true;

  maxDistance = new FormControl<number>(50);

  cities = new FormControl<City[]>([]);
  allCities: City[] = [];

  dateRange = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  constructor() {
  }

  ngOnInit(): void {
    // Setting possible values
    this.allEventTypes = this.data.allEventTypes;

    this.fullMaxAttendancesRange = this.data.fullMaxAttendancesRange;
    if (this.fullMaxAttendancesRange.length == 0 || this.fullMaxAttendancesRange[0] == this.fullMaxAttendancesRange[1]) {
      this.fullMaxAttendancesRange = [0, 1];
      this.disabledAttendancesSlider = true;
      this.data.filter.minMaxAttendances = 0;
      this.data.filter.maxMaxAttendances = 1;
    } else
      this.disabledAttendancesSlider = false;
    if (this.data.filter.minMaxAttendances == undefined) {
      this.data.filter.minMaxAttendances = this.fullMaxAttendancesRange[0];
      this.data.filter.maxMaxAttendances = this.fullMaxAttendancesRange[1];
    }

    this.allCities = this.data.allCities;

    // Loading previously set values
    if (this.data.filter.types) {
      this.eventTypes.setValue(this.data.selectedEventTypes);
    }
    if (this.data.filter.latitudes) {
      this.cities.setValue(this.data.selectedCities)
      this.maxDistance.setValue(this.data.filter.maxDistance || 50);
    }
    else
      this.maxDistance.setValue(50);

    if (this.data.filter.startDate)
      this.dateRange.get("start")!.setValue(new Date(this.data.filter.startDate))
    if (this.data.filter.endDate)
      this.dateRange.get("end")!.setValue(new Date(this.data.filter.endDate))
  }

  applyFilter(): void {
    if (this.eventTypes.value && this.eventTypes.value.length > 0){
      this.data.selectedEventTypes = this.eventTypes.value;
      this.data.filter.types = this.eventTypes.value.map(type => type.id);
    } else {
      this.data.selectedEventTypes = [];
      this.data.filter.types = undefined;
    }

    if (this.disabledAttendancesSlider) {
      this.data.filter.minMaxAttendances = undefined;
      this.data.filter.maxMaxAttendances = undefined;
    }
    
    if (this.cities.value && this.cities.value.length > 0 && this.maxDistance.value){
      this.data.selectedCities = this.cities.value;
      this.data.filter.latitudes = this.cities.value.map(city => city.lat);
      this.data.filter.longitudes = this.cities.value.map(city => city.lng);
      this.data.filter.maxDistance = this.maxDistance.value;
    } else {
      this.data.selectedCities = [];
      this.data.filter.latitudes = undefined;
      this.data.filter.longitudes = undefined;
      this.data.filter.maxDistance = undefined;
    }

    if (this.dateRange.get("start")!.value != null && this.dateRange.get("end")!.value != null) {
      this.data.filter.startDate = this.dateRange.get("start")!.value?.getTime();
      this.data.filter.endDate = this.dateRange.get("end")!.value?.getTime();
    } else {
      this.data.filter.startDate = undefined;
      this.data.filter.endDate = undefined;
    }

    this.dialog.close(this.data);
  }

  formatDistanceLabel(value: number): string {
    return `${value}km`;
  }

  clearDate(): void {
    this.dateRange.get("start")!.setValue(null);
    this.dateRange.get("end")!.setValue(null);
  }
}
