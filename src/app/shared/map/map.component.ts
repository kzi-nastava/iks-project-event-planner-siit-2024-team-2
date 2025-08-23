import {
  Component,
  AfterViewInit,
  OnInit,
  PLATFORM_ID,
  Inject,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  Input
} from '@angular/core';
import { MapService } from './map.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [FormsModule, CommonModule],
})
export class MapComponent implements AfterViewInit, OnInit, OnChanges {
  private map: any;
  L: any;
  private currentMarker: any;
  searchQuery: string = '';

  @Input() latitude: number = 0;
  @Input() longitude: number = 0;
  @Input() readonly: boolean = false;
  @Output() coordinatesSelected = new EventEmitter<{ lat: number; lng: number }>();

  constructor(
    private mapService: MapService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if ((changes['latitude'] || changes['longitude']) && this.map) {
      this.setMarker(this.latitude, this.longitude);
    }
  }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      this.L = L;

      this.map = this.L.map('map', {
        center: [this.latitude || 45.2396, this.longitude || 19.8227],
        zoom: 13,
      });

      const tiles = this.L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          minZoom: 3,
          attribution: '&copy; OpenStreetMap contributors',
        }
      );
      tiles.addTo(this.map);

      if (!this.readonly) {
        this.registerOnClick();
      }

      this.setMarker(this.latitude, this.longitude);
    }
  }

  ngAfterViewInit(): void {}

  setMarker(lat: number, lng: number): void {
    if (!lat || !lng || !this.L || !this.map) return;

    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    this.currentMarker = this.L.marker([lat, lng])
      .addTo(this.map)
      .bindPopup('Selected Location')
      .openPopup();

    this.map.setView([lat, lng], 13);
  }

  onSearch(event: Event): void {
    event.preventDefault();
    if (this.searchQuery.trim()) {
      this.search(this.searchQuery.trim());
    }
  }

  search(text: string): void {
    this.mapService.search(text).subscribe({
      next: (result) => {
        if (result.length === 0) {
          console.error('No location found.');
          return;
        }

        const lat = result[0].lat;
        const lon = result[0].lon;

        this.setMarker(lat, lon);
        this.coordinatesSelected.emit({ lat, lng: lon });
      },
      error: (err) => {
        console.error('Search error:', err);
      },
    });
  }

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      if (this.readonly) return;

      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      this.setMarker(lat, lng);
      this.coordinatesSelected.emit({ lat, lng });
    });
  }
}
