import { Component } from '@angular/core';
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
export class AgendaComponent {

  activities: any[] = [];
  eventId: number = -1;
  displayedColumns: string[] = ['name', 'start', 'end', 'description', 'location', 'actions'];
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const eventId = params['id'];
      if (eventId) {
        this.eventId = Number(eventId);
        this.fetchAgendaData(eventId);
      }
    });
  }
  fetchAgendaData(eventId: any) {
    this.eventService.getAgenda(eventId).subscribe({
      next: (agenda: any) => {
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

  editActivity(activity: any) {
    this.dialog.open(ActivityFormDialogComponent, {
      data: {
        activity
      }
    }).afterClosed().subscribe(result => {
      if (result) {
        this.eventService.updateActivity(this.eventId, activity.id, activity).subscribe({
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
      }});
  }

  deleteActivity(activityId: any) {
    this.dialog.open(DeleteDialogComponent).afterClosed().subscribe(result => {
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
      if (this.isTimeValid(result.activityStart, result.activityEnd)) {
        this.snackBar.open('Invalid time range', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'],
        });
        return;
      }
      if (result) {
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

  isTimeValid(start: number, end: number): boolean {
    if (start >= end) return false;
    if (this.activities.length > 0 && this.activities.some(activity => {
      return (start < activity.activityEnd && end > activity.activityStart) ||
             (activity.activityStart < end && activity.activityEnd > start) ||
             (start === activity.activityStart && end === activity.activityEnd);
    })) return false;
    
    return true;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
    ) {}
  
  formatMillisToTime(millis: number): string {
    const hours = Math.floor(millis / (1000 * 60 * 60));
    const minutes = Math.floor((millis % (1000 * 60 * 60)) / (1000 * 60));
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${paddedMinutes} ${period}`;
  }

}
