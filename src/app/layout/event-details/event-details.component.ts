import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { Event } from '../../model/event';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MapComponent } from '../../shared/map/map.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MapComponent, MatIconModule,],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css'
})
export class EventDetailsComponent implements OnInit {
  eventId!: number;
  eventData?: Event;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const eventId = params['id'];
      if (eventId) {
        this.fetchEventData(eventId);
        this.eventId = Number(eventId);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private fetchEventData(eventId: number): void {
    this.eventService.getEvent(eventId).subscribe({
      next: (event) => {
        this.eventData = event;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load event details.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  openAgenda() {
    this.router.navigate(['/agenda'], { queryParams: { id: this.eventId, readonly: true } });
  }
  downloadPdf() {
    this.eventService.dowloadPdf(this.eventId).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `event-${this.eventId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this.error = 'Failed to download PDF.';
        console.error(err);
      }
    });
  }
}
