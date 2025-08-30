import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EventService } from '../../services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PagedModel } from '../../shared/model/paged-model';
import { EventSummaryDto } from '../../services/dtos/event/event-summary.dto';
import { EventFilterParams } from '../../parameters/event-filter-params';
import { SortDirection } from '../../shared/model/sort-direction';
import { DragScrollComponent, DragScrollItemDirective } from 'ngx-drag-scroll';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, OnInit } from '@angular/core';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { ServiceProductSummaryDto } from '../../services/dtos/service-product/service-product-summary.dto';
import { ServiceProductFilterParams } from '../../parameters/service-product-filter-params';
import { ServiceProductService } from '../../services/service-product/service-product.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../../environments/environment';
import { HomeEventFilterDialogComponent } from '../../dialog/home-event-filter-dialog/home-event-filter-dialog.component';
import { HomeServiceProductFilterDialogComponent } from '../../dialog/home-service-product-filter-dialog/home-service-product-filter-dialog.component';
import { EventType } from '../../model/event/event-type';
import { EventTypeService } from '../../services/event-type.service';
import { ServiceProductFilteringValues } from '../../services/dtos/service-product/service-product-filtering-values.dto';
import { HomeEventFilterDialogParams } from '../../parameters/home-event-filter-dialog-params';
import { HomeServiceProductFilterDialogParams } from '../../parameters/home-service-product-filter-dialog-params';
import { City } from '../../model/utils/city';
import { JsonService } from '../../services/utils/json.service';
import { ServiceProductCategory } from '../../model/service-product/service-product-category';
import { MatMenuModule } from '@angular/material/menu';
import { ToastService } from '../../services/utils/toast-service';
import { ReportDialogComponent } from '../../dialog/report-dialog/report-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth-service.service';
import { UserService } from '../../services/user/user.service';
import { HttpErrorResponse } from '@angular/common/http';

const pageSize = 12;
const imagesApi = "api/images/";
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatSidenavModule, MatCardModule, MatButtonModule, CommonModule, MatFormField, MatInputModule, MatIconModule, MatTabsModule,
    MatDialogModule, MatSelect, MatOption, MatPaginatorModule, MatProgressSpinnerModule, DragScrollComponent, DragScrollItemDirective,
    MatMenuModule, ReactiveFormsModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  topEvents: EventSummaryDto[] = [];
  otherEvents: EventSummaryDto[] = [];
  topServiceProducts: ServiceProductSummaryDto[] = [];
  otherServiceProducts: ServiceProductSummaryDto[] = [];
  searchTerm = '';
  eventSelectedSortOption = 'date-desc';
  serviceProductSelectedSortOption = 'name-asc';
  isBrowser: boolean;
  isLoadingTopEvents = true;
  isLoadingTopServiceProducts = true;
  isLoadingEvents = true;
  isLoadingServiceProducts = true;
  selectedTabIndex = 0;
  showedLoadError = false;

  // Filtering
  eventFilter: EventFilterParams = {size:pageSize, sortBy: "date", sortDirection: SortDirection.DESC};
  serviceProductFilter: ServiceProductFilterParams = {size: pageSize, sortBy: "name", sortDirection: SortDirection.ASC};
  allEventTypes: EventType[] = [];
  selectedEventTypes: EventType[] = [];
  fullMaxAttendancesRange: number[] = [];
  filteringValues?: ServiceProductFilteringValues;
  fetchedEventTypes = false;
  fetchedMaxAttendances = false;
  fetchedFilteringValues = false;
  cities: City[] = [];
  selectedCities: City[] = [];
  selectedCategories: ServiceProductCategory[] = [];
  selectedAvailableTypes: EventType[] = [];


  // Injected
  readonly dialog = inject(MatDialog);
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly eventService = inject(EventService);  
  readonly eventTypeService = inject(EventTypeService);  
  readonly serviceProductService = inject(ServiceProductService);  
  readonly jsonService = inject(JsonService);
  readonly platformId = inject(PLATFORM_ID);
  readonly snackBar = inject(MatSnackBar);
  readonly toastService = inject(ToastService);
  readonly authService = inject(AuthService);
  readonly userService = inject(UserService);

  // Pagination
  totalElements: number = pageSize * 8; // this variable is reference, other two are for storing the value between switching
  eventTotalElements: number = this.totalElements; 
  serviceProductTotalElements: number = this.totalElements;
  pageIndex = 0; // same as for totalElements
  eventPageIndex = 0;
  serviceProductPageIndex = 0;
  pageSize: number = pageSize; // same as for totalElements
  eventPageSize: number = pageSize;
  serviceProductPageSize: number = pageSize;
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }
  readonly isAdmin = this.authService.getUserRole() === 'ADMIN';

  ngOnInit(): void {
    this.fetchTop5();
    this.fetchEvents();
    this.fetchServiceProducts();
    this.fetchFilteringValue();
    this.loadCities();
    this.loadFavorites();
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
        this.topEvents = JSON.parse(JSON.stringify(response));
        this.addEmailBreaks(this.topEvents);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to load top events:', err);
        this.showLoadError();
      }
    });
    this.serviceProductService.getTop5()
    .pipe(finalize(() => this.isLoadingTopServiceProducts = false))
    .subscribe({
      next: (response : ServiceProductSummaryDto[]) => {
        this.topServiceProducts = JSON.parse(JSON.stringify(response));
        this.addEmailBreaks(this.topServiceProducts);
        this.convertImageUrls(this.topServiceProducts);
      },
      error: (err: HttpErrorResponse) => {
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
          next: (response : PagedModel<EventSummaryDto>) => {
            this.eventTotalElements = response.page.totalElements;
            
            if (this.eventTotalElements <= this.eventPageSize * this.eventPageIndex ) {
              this.eventPageIndex = 0;
              this.eventFilter.page = 0;
              if (this.selectedTabIndex == 0)
                this.pageIndex = 0;
            }

            if (this.selectedTabIndex == 0)
              this.totalElements = response.page.totalElements;

            this.otherEvents = JSON.parse(JSON.stringify(response.content));
            this.addEmailBreaks(this.otherEvents);
          },
          error: (err: HttpErrorResponse) => {
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
          next: (response : PagedModel<ServiceProductSummaryDto>) => {
            this.serviceProductTotalElements = response.page.totalElements;

            if (this.selectedTabIndex == 1)
              this.totalElements = response.page.totalElements;
            this.otherServiceProducts = JSON.parse(JSON.stringify(response.content));
            this.addEmailBreaks(this.otherServiceProducts);
            this.convertImageUrls(this.otherServiceProducts);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Failed to load serviceproducts:', err);
            this.showLoadError();
          }
        });
  }
  fetchFilteringValue(): void {
    this.eventTypeService.getAll()
      .subscribe({
          next: (response : EventType[]) => {
            this.allEventTypes = response.map(obj => ({ ...obj }));
            this.fetchedEventTypes = true;
          },
          error: (err: HttpErrorResponse) => {
            console.error('Failed to load event types:', err);
            this.showLoadError();
          }
        });
    this.eventService.getMaxAttendancesRange()
      .subscribe({
          next: (response : number[]) => {
            this.fullMaxAttendancesRange = response.map(num => num);
            this.fetchedMaxAttendances = true;
          },
          error: (err: HttpErrorResponse) => {
            console.error('Failed to load max attendances range:', err);
            this.showLoadError();
          }
        });
    this.serviceProductService.getFilteringValues()
      .subscribe({
          next: (response : ServiceProductFilteringValues) => {
            this.filteringValues = JSON.parse(JSON.stringify(response));
            this.fetchedFilteringValues = true;
          },
          error: (err: HttpErrorResponse) => {
            console.error('Failed to load service product filtering values:', err);
            this.showLoadError();
          }
        });
  }
  loadCities(): void {
    this.jsonService.getCities()
      .subscribe({
          next: (response : City[]) => {
            this.cities = response.map(obj => ({ ...obj })).sort((a, b) => a.city.localeCompare(b.city));
          },
          error: (err: HttpErrorResponse) => {
            console.error('Failed to load cities:', err);
            this.showLoadError();
          }
      })
  }

  onSortEvents(): void {
    const sortTokens = this.eventSelectedSortOption.split('-');
    this.eventFilter.sortDirection = sortTokens[1] == "asc" ? SortDirection.ASC : SortDirection.DESC;
    this.eventFilter.sortBy = sortTokens[0];
    this.fetchEvents();
  }
  onSortServiceProducts(): void {
    const sortTokens = this.serviceProductSelectedSortOption.split('-');
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

  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value;
    
    if (this.selectedTabIndex == 0) {
      this.eventFilter.name = this.searchTerm === '' ? undefined : this.searchTerm;
      this.eventPageIndex = 0;
      this.pageIndex = 0;
      this.eventFilter.page = 0;
      this.fetchEvents();
    } else {
      this.serviceProductFilter.name = this.searchTerm === '' ? undefined : this.searchTerm;
      this.serviceProductPageIndex = 0;
      this.pageIndex = 0;
      this.serviceProductFilter.page = 0;
      this.fetchServiceProducts();
    }
  }
  
  openEventFilterDialog(): void {
    const data: HomeEventFilterDialogParams = { // we will clone all data in case filter dialog tries to change them
      filter: {...this.eventFilter},
      allEventTypes: [...this.allEventTypes],
      selectedEventTypes: [...this.selectedEventTypes],
      fullMaxAttendancesRange: [...this.fullMaxAttendancesRange],
      allCities: [...this.cities],
      selectedCities: [...this.selectedCities]
    }
    const dialogRef = this.dialog.open(HomeEventFilterDialogComponent, {data: data});

    dialogRef.afterClosed().subscribe((result: HomeEventFilterDialogParams) => {
      if (result) {
        this.eventFilter = result.filter;
        this.selectedCities = result.selectedCities;
        this.selectedEventTypes = result.selectedEventTypes;
        this.eventPageIndex = 0;
        if (this.selectedTabIndex == 0)
          this.pageIndex = 0;
        this.eventFilter.page = 0;
        this.fetchEvents();
      }
    });
  }
  
  openServiceProductFilterDialog(): void {
    if (this.filteringValues == undefined)
      return;
    const data: HomeServiceProductFilterDialogParams = { // we will clone all data in case filter dialog tries to change them
      filter: {...this.serviceProductFilter},
      filteringValues: {...this.filteringValues},
      selectedCategories: [...this.selectedCategories],
      selectedEventTypes: [...this.selectedAvailableTypes]
    }
    const dialogRef = this.dialog.open(HomeServiceProductFilterDialogComponent, {data: data});

    dialogRef.afterClosed().subscribe((result: HomeServiceProductFilterDialogParams) => {
      if (result) {
        this.serviceProductFilter = result.filter;
        this.selectedCategories = result.selectedCategories;
        this.selectedAvailableTypes = result.selectedEventTypes;
        this.serviceProductPageIndex = 0;
        if (this.selectedTabIndex == 1)
          this.pageIndex = 0;
        this.serviceProductFilter.page = 0;
        this.fetchServiceProducts();
      }
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
  convertImageUrls(array: ServiceProductSummaryDto[]) {
    array.forEach(element => {
      if (element.image != null)
        element.image = environment.apiHost + imagesApi + element.image;
    });
  }
  navigateToEventDetails(eventId?: number): void {
    this.router.navigate(['/event-details'], { queryParams: { id: eventId } });
  }

  navigateToSpDetails(spId?: number): void {
    this.router.navigate(['/sp-details'], { queryParams: { id: spId } });
  }
  
  openReportDialog(email: string, name: string) {
    email = email.replaceAll('<wbr>', '');
    this.dialog.open(ReportDialogComponent, {data: {email: email, name: name}});
  }

  suspendUser(email: string) {
    email = email.replaceAll('<wbr>', '');
    this.userService.suspendUser(email).subscribe({
      next: () => {
        this.toastService.show('User suspended successfully', 2000);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Failed to suspend user:', err);
        this.toastService.show('Failed to suspend user', 2000);
      }
    });
  }

  favoriteEventIds: Set<number> = new Set<number>();

  loadFavorites(): void {
    this.userService.getFavoriteEvents(Number(localStorage.getItem('userId'))).subscribe({
      next: (favorites: EventSummaryDto[]) => {
        this.favoriteEventIds = new Set(favorites.map(f => f.id!));
      },
      error: (err) => console.error('Failed to load favorites:', err)
    });
  }

  isEventFavorite(eventId?: number): boolean {
    return eventId != null && this.favoriteEventIds.has(eventId);
  }

  addToFavorites(eventId?: number): void {
    if (!eventId) return;
    this.userService.addFavoriteEvent(Number(localStorage.getItem('userId')), eventId).subscribe({
      next: () => {
        this.favoriteEventIds.add(eventId);
        this.toastService.show('Added to favorites ❤️', 1500);
      },
      error: (err) => {
        console.error('Failed to add favorite:', err);
        this.toastService.show('Could not add favorite', 1500);
      }
    });
  }

  removeFromFavorites(eventId?: number): void {
    if (!eventId) return;
    this.userService.removeFavoriteEvent(Number(localStorage.getItem('userId')), eventId).subscribe({
      next: () => {
        this.favoriteEventIds.delete(eventId);
        this.toastService.show('Removed from favorites 💔', 1500);
      },
      error: (err) => {
        console.error('Failed to remove favorite:', err);
        this.toastService.show('Could not remove favorite', 1500);
      }
    });
  }

}
