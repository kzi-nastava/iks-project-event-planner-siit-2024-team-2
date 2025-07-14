import { CommonModule } from '@angular/common';
import { Component, importProvidersFrom, inject } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { EPEvent } from '../../model/ep-event';
import { Service } from '../../model/service';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import {MatPaginatorModule} from '@angular/material/paginator';
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
import {MatTabsModule} from '@angular/material/tabs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatSidenavModule, MatCardModule, MatButtonModule, CommonModule, MatFormField, MatInputModule, MatIconModule, MatTabsModule,
    MatSelect, MatOption, MatPaginatorModule, DragScrollComponent, DragScrollItemDirective,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  host: { 'class': 'no-padding-page' }
})
export class HomeComponent {
  topEvents: EventSummaryDto[] = [];
  otherEvents: EPEvent[] = [];
  topServiceProducts: Service[] = [];
  otherServiceProducts: Service[] = [];
  searchTerm: string = '';
  selectedSortOption: string = 'date-desc';
  dialog = inject(MatDialog);
  route = inject(ActivatedRoute);
  router = inject(Router);
  eventService = inject(EventService);  
  platformId = inject(PLATFORM_ID);
  isBrowser: boolean;
  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.initEvents();
    this.initServices();
  }
  initEvents(): void {
    for (let i = 0; i < 5; i++) {
      let event: EventSummaryDto = {
        id: i,
        name: "Birthday",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor",
        creatorEmail: "this.is.a.very.long.email@gmail.mail.com",
        creatorName: "Petar Petrović Peterović",
        date: 10000000,
        isOpen: true,
        latitude: 1, longitude: 1, maxAttendances: 1,
        type:{name: "test", recommendedServiceProductIds:null}
      }
      if (event.creatorEmail != null)
        event.creatorEmail = event.creatorEmail.replace(/\./g, '.<wbr>');
      this.topEvents.push(event);
    }
    for (let i = 0; i < 12; i++) {
      this.otherEvents.push(new EPEvent(i+5, "Birthday", "Perin rođendan", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"));
    }
  }
  initServices(): void {
    for (let i = 0; i < 5; i++) {
      this.topServiceProducts.push(new Service(i, "Catering", "Peric catering", "We offer catering for lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        "no specifies", 7, 1, ["catering.jpeg"], ["Wedding", "Birthday"], 1, 7, 3));
    }
    for (let i = 0; i < 12; i++) {
      this.otherServiceProducts.push(new Service(i+5, "Catering", "Peric catering", "We offer catering for lorem ipsum. Lorem ipsum lorem ipsum lorem ipsum.",
        "no specifies", 7, 1, ["catering.jpeg"], ["Wedding", "Birthday"], 1, 7, 3));
    }
  }

  sort(): void {
    let sortTokens = this.selectedSortOption.split('-');
    const filters: EventFilterParams = {
      sortDirection: sortTokens[1] == "asc" ? SortDirection.ASC : SortDirection.DESC,
      sortBy: sortTokens[0]
    }
    this.eventService.getAllSummaries(filters).subscribe({
          next: (response : PagedResponse<EventSummaryDto>) => {
            console.log(response.content);
          },
          error: (err: any) => {
            console.error('Failed to load event types:', err);
          }
        });
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
}
