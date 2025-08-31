import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { EventTypeService } from '../../services/event-type.service';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { EventFilterParams } from '../../parameters/event-filter-params';
import { PagedModel } from '../../shared/model/paged-model';
import { EventTypeDto } from '../../services/dtos/event/event-type.dto';

@Component({
  selector: 'app-my-event-types',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatPaginatorModule, MatIconModule],
  templateUrl: './my-event-types.component.html',
  styleUrls: ['./my-event-types.component.css'],
})
export class MyEventTypesComponent implements OnInit {
  private eventTypeService = inject(EventTypeService);
  private router = inject(Router);
  dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);


  myEventTypes: EventTypeDto[] = [];
  totalEventTypes = 0;
  pageSize = 10;
  pageIndex = 0;

  loading = false;
  error = '';

  ngOnInit() {
    this.loadMyEventTypes();
  }

  loadMyEventTypes() {
    this.loading = true;

    const filters: EventFilterParams = {
      page: this.pageIndex,
      size: this.pageSize
    };

    this.eventTypeService.getAllPaginated(filters).subscribe({
      next: (paged: PagedModel<EventTypeDto>) => {
        console.log(paged);
        this.myEventTypes = paged.content;
        this.totalEventTypes = paged.page.totalElements;
        this.pageIndex = paged.page.number;
          this.pageSize = paged.page.size;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load event types.';
        this.loading = false;
      } 
    });
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.loadMyEventTypes();
  }

  navigateToEventTypeDetails(eventTypeId?: number): void {
    this.router.navigate(['/new-event-type'], { queryParams: { id: eventTypeId } });
  }

  deleteEventType(eventTypeId: number) {
    this.dialog.open(DeleteDialogComponent, { data: { entityName: 'event type' } })
      .afterClosed().subscribe(result => {
        if (result) {
          this.eventTypeService.delete(eventTypeId).subscribe({
            next: () => {
              this.loadMyEventTypes();
              this.snackBar.open('Event type deleted successfully', 'Close', {
                duration: 3000,
              });
            },
            error: (err) => {
              console.error('Failed to delete event type:', err);
              this.snackBar.open('Failed to delete event type', 'Close', {
                duration: 3000,
              });
            }
          });
        }
      }, error => {
        console.error('Error opening delete dialog:', error);
      });
  }
}
