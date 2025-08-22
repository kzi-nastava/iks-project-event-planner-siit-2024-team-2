import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    ReactiveFormsModule,
    HttpClientTestingModule,
    RouterTestingModule,
    NoopAnimationsModule,
    HttpClientTestingModule,
    MatDialogModule,
    HttpClientModule,
  ],
  exports: [
    ReactiveFormsModule,
    HttpClientTestingModule,
    RouterTestingModule,
    NoopAnimationsModule,
    HttpClientTestingModule,
    MatDialogModule,
    HttpClientModule,
  ]
})
export class SharedTestingModule {}