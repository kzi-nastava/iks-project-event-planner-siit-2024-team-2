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
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatPaginatorModule],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css'],
})
export class MyEventsComponent implements OnInit {
  
  deleteEvent(eventId: number) {
    this.dialog.open(DeleteDialogComponent, {data: {entityName: 'event'}}).afterClosed().subscribe(result => {
      if (result) {
        this.eventService.delete(eventId).subscribe({
          next: () => {
            this.loadMyEvents(); 
            this.snackBar.open('Event deleted successfully', 'Close', {
              duration: 3000,
            });
          },
          error: (err) => {
            console.error('Failed to delete event:', err);
            this.snackBar.open('Failed to delete event', 'Close', {
              duration: 3000,
            });
          }
        });
      }
    }, error => {
      console.error('Error opening delete dialog:', error);
    });
  }
  myEvents: any[] = [];
  totalEvents = 0;
  pageSize = 10;
  pageIndex = 0;

  loading = false;
  error = '';

  constructor(private eventService: EventService, private router: Router, public dialog: MatDialog, private snackBar: MatSnackBar) {}

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