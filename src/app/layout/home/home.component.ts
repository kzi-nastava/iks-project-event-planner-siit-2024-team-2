import { CommonModule } from '@angular/common';
import { Component, importProvidersFrom, inject, ViewChild } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { EPEvent } from '../../model/ep-event';
import { Service } from '../../model/service';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FilterDialogComponent } from '../../dialog/filter-dialog/filter-dialog.component';
import { EventService } from '../../services/event.service';
import { ActivatedRoute, EventType, Router } from '@angular/router';
import { PagedResponse } from '../../shared/model/paged-response.model';
import { Event } from '../../model/event';
import { EventSummaryDto } from '../../services/dtos/event/event-summary.dto';
import { EventFilterParams } from '../../parameters/event-filter-params';
import { SortDirection } from '../../shared/model/sort-direction';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import {MatTabChangeEvent, MatTabsModule} from '@angular/material/tabs';
import { ServiceProductSummaryDto } from '../../services/dtos/service-product/service-product-summary.dto';
import { ServiceProductFilterParams } from '../../parameters/service-product-filter-params';
import { ServiceProductService } from '../../services/service-product/service-product.service';
import {MatProgressSpinner, MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

const pageSize = 12;
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatSidenavModule, MatCardModule, MatButtonModule, CommonModule, MatFormField, MatInputModule, MatIconModule, MatTabsModule,
    MatSelect, MatOption, MatPaginatorModule, MatProgressSpinnerModule, DragScrollComponent, DragScrollItemDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  host: { 'class': 'no-padding-page' }
})
export class HomeComponent {
  topEvents: EventSummaryDto[] = [];
  otherEvents: EventSummaryDto[] = [];
  topServiceProducts: ServiceProductSummaryDto[] = [];
  otherServiceProducts: ServiceProductSummaryDto[] = [];
  searchTerm: string = '';
  eventSelectedSortOption: string = 'date-desc';
  serviceProductSelectedSortOption: string = 'name-asc';
  isBrowser: boolean;
  eventFilter: EventFilterParams = {size:pageSize, sortBy: "date", sortDirection: SortDirection.DESC};
  serviceProductFilter: ServiceProductFilterParams = {size: pageSize, sortBy: "name", sortDirection: SortDirection.ASC};
  isLoadingTopEvents: boolean = true;
  isLoadingTopServiceProducts: boolean = true;
  isLoadingEvents: boolean = true;
  isLoadingServiceProducts: boolean = true;
  selectedTabIndex = 0;
  showedLoadError = false;
  
  // Injected
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  router = inject(Router);
  eventService = inject(EventService);  
  serviceProductService = inject(ServiceProductService);  
  platformId = inject(PLATFORM_ID);
  snackBar = inject(MatSnackBar);

  // Pagination
  totalElements: number = pageSize * 8; // this variable is reference, other two are for storing the value between switching
  eventTotalElements: number = this.totalElements; 
  serviceProductTotalElements: number = this.totalElements;
  pageIndex: number = 0; // same as for totalElements
  eventPageIndex: number = 0;
  serviceProductPageIndex: number = 0;
  pageSize: number = pageSize;
  eventPageSize: number = pageSize;
  serviceProductPageSize: number = pageSize;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.fetchTop5();
    this.fetchEvents();
    this.fetchServiceProducts();
  }

  fetchTop5(): void {
    this.isLoadingTopEvents = true;
    this.isLoadingTopServiceProducts = true;
    this.topEvents = [];
    this.topServiceProducts = [];
    this.eventService.getTop5()
      .pipe(finalize(() => this.isLoadingTopEvents = false))
      .subscribe({
          next: (response : EventSummaryDto[]) => {
            this.topEvents = response;
            this.addEmailBreaks(this.topEvents);
          },
          error: (err: any) => {
            console.error('Failed to load top events:', err);
            this.showLoadError();
          }
        });
    this.serviceProductService.getTop5()
      .pipe(finalize(() => this.isLoadingTopServiceProducts = false))
      .subscribe({
          next: (response : ServiceProductSummaryDto[]) => {
            this.topServiceProducts = response;
            this.addEmailBreaks(this.topServiceProducts);
          },
          error: (err: any) => {
            console.error('Failed to load top serviceproducts:', err);
            this.showLoadError();
          }
        });
  }
  fetchEvents(): void {
    this.isLoadingEvents = true;
    this.otherEvents = [];
    this.eventService.getAllSummaries(this.eventFilter)
      .pipe(finalize(() => this.isLoadingEvents = false))
      .subscribe({
          next: (response : PagedResponse<EventSummaryDto>) => {
            this.eventTotalElements = response.totalElements;
            // this.eventPageIndex = 0;
            // this.eventFilter.page = 0;
            if (this.selectedTabIndex == 0) {
              // this.pageIndex = 0;
              this.totalElements = response.totalElements;
            }
            this.otherEvents = response.content;
            this.addEmailBreaks(this.otherEvents);
          },
          error: (err: any) => {
            console.error('Failed to load events:', err);
            this.showLoadError();
          }
        });
  }
  fetchServiceProducts(): void {
    this.isLoadingServiceProducts = true;
    this.otherServiceProducts = [];
    this.serviceProductService.getAllSummaries(this.serviceProductFilter)
      .pipe(finalize(() => this.isLoadingServiceProducts = false))
      .subscribe({
          next: (response : PagedResponse<ServiceProductSummaryDto>) => {
            this.serviceProductTotalElements = response.totalElements;
            // this.serviceProductPageIndex = 0;
            // this.serviceProductFilter.page = 0;
            if (this.selectedTabIndex == 1) {
              // this.pageIndex = 0;
              this.totalElements = response.totalElements;
            }
            this.otherServiceProducts = response.content;
            this.addEmailBreaks(this.otherServiceProducts);
          },
          error: (err: any) => {
            console.error('Failed to load serviceproducts:', err);
            this.showLoadError();
          }
        });
  }

  onSortEvents(): void {
    let sortTokens = this.eventSelectedSortOption.split('-');
    this.eventFilter.sortDirection = sortTokens[1] == "asc" ? SortDirection.ASC : SortDirection.DESC;
    this.eventFilter.sortBy = sortTokens[0];
    this.fetchEvents();
  }
  onSortServiceProducts(): void {
    let sortTokens = this.serviceProductSelectedSortOption.split('-');
    this.serviceProductFilter.sortDirection = sortTokens[1] == "asc" ? SortDirection.ASC : SortDirection.DESC;
    this.serviceProductFilter.sortBy = sortTokens[0];
    this.fetchServiceProducts();
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (event.index == 0) {
      this.totalElements = this.eventTotalElements;
      this.pageIndex = this.eventPageIndex;
      this.pageSize = this.eventPageSize;
    } else {
      this.totalElements = this.serviceProductTotalElements;
      this.pageIndex = this.serviceProductPageIndex;
      this.pageSize = this.serviceProductPageSize;
    }
    this.selectedTabIndex = event.index;
  }
  
  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.selectedTabIndex === 0) {
      this.eventPageIndex = event.pageIndex;
      this.eventFilter.page = this.eventPageIndex;
      this.eventPageSize = event.pageSize;
      this.eventFilter.size = this.eventPageSize;
      this.fetchEvents();
    } else {
      this.serviceProductPageIndex = event.pageIndex;
      this.serviceProductFilter.page = this.serviceProductPageIndex;
      this.serviceProductPageSize = event.pageSize;
      this.serviceProductFilter.size = this.serviceProductPageSize;
      this.fetchServiceProducts();
    }
  }

  onSearch(event: any): void {
    this.searchTerm = event.target.value;
    console.log('Search term:', this.searchTerm);
  }

  
  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  showLoadError(): void {
    if (!this.showedLoadError) {
      this.snackBar.open('Failed to load data. Please try again later.', 'Close', {
        duration: 6000,
        panelClass: ['snack-error']
      });
      this.showedLoadError = true;
    }
  }

  addEmailBreaks(array: EventSummaryDto[] | ServiceProductSummaryDto[]) {
    array.forEach(element => {
      if (element.creatorEmail != null)
        element.creatorEmail = element.creatorEmail.replace(/\./g, '.<wbr>');
    });
  }
}
