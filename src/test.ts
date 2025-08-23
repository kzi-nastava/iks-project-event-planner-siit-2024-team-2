import 'zone.js/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting
} from '@angular/platform-browser-dynamic/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SharedTestingModule } from './testing/shared-testing.module';

declare const require: {
  context(path: string, deep?: boolean, filter?: RegExp): {
    keys(): string[];
    <T>(id: string): T;
  };
};

getTestBed()
  .configureTestingModule({
    imports: [SharedTestingModule]})
  .initTestEnvironment(
    BrowserDynamicTestingModule,
    platformBrowserDynamicTesting()
  );

const context = require.context('./', true, /\.spec\.ts$/);
context.keys().forEach(context);
