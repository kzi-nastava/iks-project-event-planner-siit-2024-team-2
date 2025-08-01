import { Component, OnInit } from '@angular/core';
import { Event } from '../../model/event';
import { EventService } from '../../services/event.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { EventFilterParams } from '../../parameters/event-filter-params';
import { PagedModel } from '../../shared/model/paged-model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css'],
})
export class MyEventsComponent implements OnInit {
  deleteEvent(eventId: number) {
    
    this.eventService.delete(eventId).subscribe({
      next: () => {
        this.loadMyEvents();
      },
      error: (err) => {
        console.error('Failed to delete event:', err);
      }
    });
  }
  myEvents: any[] = [];
  totalEvents = 0;
  pageSize = 10;
  pageIndex = 0;

  loading = false;
  error = '';

  constructor(private eventService: EventService, private router: Router) {}

  ngOnInit() {
    this.loadMyEvents();
  }

  loadMyEvents() {
    this.loading = true;
    const filters: EventFilterParams = {
      page: this.pageIndex,
      size: this.pageSize
    };

    this.eventService.getAll(filters).subscribe({
      next: (paged: PagedModel<Event>) => {
        this.myEvents = paged.content;
        this.totalEvents = paged.page.totalElements;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load events.';
        this.loading = false;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadMyEvents();
  }
  navigateToEventDetails(eventId?: number): void {
    this.router.navigate(['/new-event'], { queryParams: { id: eventId } });
  }
}