import { Component, OnInit, inject } from '@angular/core';
import { EventService } from '../../services/event.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ActivityFormDialogComponent } from '../../dialog/activity-form-dialog/activity-form-dialog.component';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { Activity } from '../../model/event/activity';

@Component({
  selector: 'app-agenda',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule
  ],
  templateUrl: './agenda.component.html',
  styleUrl: './agenda.component.css'
})
export class AgendaComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private eventService = inject(EventService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  readonly = false;
  activities: Activity[] = [];
  eventId = -1;
  displayedColumns: string[] = ['name', 'start', 'end', 'description', 'location'];
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const eventId = params['id'];
      this.readonly = params['readonly'] === 'true';
      if (!this.readonly) {
        this.displayedColumns.push('actions');
      }
      if (eventId) {
        this.eventId = Number(eventId);
        this.fetchAgendaData(eventId);
      }
    });
  }
  fetchAgendaData(eventId: number) {
    this.eventService.getAgenda(eventId).subscribe({
      next: (agenda: Activity[]) => {
        this.activities = agenda;
      },
      error: (err) => {
        console.error('Failed to fetch agenda:', err);
        this.snackBar.open('Failed to load agenda.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
      }
    });
  }

  editActivity(activity: Activity) {
    this.dialog.open(ActivityFormDialogComponent, {
      data: {
        activity
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        if (!this.isTimeValid(result.activityStart, result.activityEnd, activity.id || -1)) {
          this.snackBar.open('Invalid time range', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
          return;
        }
        this.eventService.updateActivity(this.eventId, activity.id || -1, result).subscribe({
          next: () => {
            this.snackBar.open('Activity updated successfully', 'Close', {
              duration: 3000,
            });
            this.fetchAgendaData(this.eventId);
          },
          error: (err) => {
            console.error('Failed to update activity:', err);
            this.snackBar.open('Failed to update activity', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
          }
        });
      }
    });
  }

  deleteActivity(activityId: number) {
    this.dialog.open(DeleteDialogComponent, {data: {entityName: 'activity'}}).afterClosed().subscribe(result => {
      if (result) {
        this.eventService.deleteActivity(this.eventId, activityId).subscribe({
          next: () => {
            this.snackBar.open('Activity deleted successfully', 'Close', {
              duration: 3000,
            });
            this.fetchAgendaData(this.eventId);
          },
          error: (err) => {
            console.error('Failed to delete activity:', err);
            this.snackBar.open('Failed to delete activity', 'Close', {
              duration: 3000,
              panelClass: ['snackbar-error'],
            });
          }
        });
      }
    }, error => {
      console.error('Error opening delete dialog:', error);
    });
  }

  addNewActivity(): void {
    const dialogRef = this.dialog.open(ActivityFormDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (!this.isTimeValid(result.activityStart, result.activityEnd)) {
          this.snackBar.open('Invalid time range', 'Close', {
            duration: 3000,
            panelClass: ['snackbar-error'],
          });
          return;
        }
        this.eventService.addActivity(this.eventId, result).subscribe({
          next: () => {
            this.snackBar.open('Activity added successfully', 'Close', { duration: 3000 });
            this.fetchAgendaData(this.eventId);
          },
          error: (err) => {
              console.error('Failed to add activity:', err);
              this.snackBar.open('Failed to add activity', 'Close', {
                duration: 3000,
                panelClass: ['snackbar-error']
            });
          }
        });
      }
    });
  }

  isTimeValid(start: number, end: number, id?: number): boolean {
    if (start >= end) return false;
    if (this.activities.some(activity => {
      if (id && activity.id === id) return false; 
      if (!activity.activityStart || !activity.activityEnd) return false;
      return (start < activity.activityEnd && end > activity.activityStart) ||
             (activity.activityStart < end && activity.activityEnd > start) ||
             (start === activity.activityStart && end === activity.activityEnd);
    })) return false;
    
    return true;
  }
  
  formatMillisToTime(millis: number): string {
    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${paddedMinutes} ${period}`;
  }

}
