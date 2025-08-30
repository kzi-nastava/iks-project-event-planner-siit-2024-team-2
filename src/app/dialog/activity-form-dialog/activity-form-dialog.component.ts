import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';
import { NgxMatTimepickerModule } from 'ngx-mat-timepicker';


@Component({
  selector: 'app-activity-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatTimepickerModule,
],
  templateUrl: './activity-form-dialog.component.html',
  styleUrls: ['./activity-form-dialog.component.css']
})
export class ActivityFormDialogComponent {
  private dialogRef = inject<MatDialogRef<ActivityFormDialogComponent>>(MatDialogRef);
  data = inject(MAT_DIALOG_DATA);

  form: FormGroup;
  isEditMode = false;

  constructor() {
    const activity = this.data ? this.data.activity : null;
    this.form = new FormGroup({
      name: new FormControl(activity?.name || '', Validators.required),
      description: new FormControl(activity?.description || ''),
      location: new FormControl(activity?.location || ''),
      startTime: new FormControl(this.millisToInputTime(activity?.activityStart), Validators.required),
      endTime: new FormControl(this.millisToInputTime(activity?.activityEnd), Validators.required),
    });
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    if (this.form.valid) {
      const { startTime, endTime, name, description, location } = this.form.value;
      this.dialogRef.close({
        name,
        description,
        location,
        activityStart: this.convertToTimeMillis(startTime),
        activityEnd: this.convertToTimeMillis(endTime)
      });
    }
  }

  millisToInputTime(millis: number): string {
    if (!millis && millis !== 0) return '';
    const date = new Date(millis);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  convertToTimeMillis(timeStr: string): number {
    const [hours, minutes] = this.parseTimeString(timeStr);
    return hours * 3600000 + minutes * 60000;
  }

  parseTimeString(time: string): [number, number] {
    const [timePart, meridiem] = time.split(' ');
    let [hours, minutes] = timePart.split(':').map(Number);

    if (meridiem?.toLowerCase() === 'pm' && hours !== 12) hours += 12;
    if (meridiem?.toLowerCase() === 'am' && hours === 12) hours = 0;

    return [hours, minutes];
  }

}
