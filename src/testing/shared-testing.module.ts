import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@NgModule({
  imports: [
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatDialogModule,
  ],
  exports: [
    ReactiveFormsModule,
    NoopAnimationsModule,
    MatDialogModule,
  ],
  
  providers: [
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]),
    { provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: {} }
  ]
})
export class SharedTestingModule {}