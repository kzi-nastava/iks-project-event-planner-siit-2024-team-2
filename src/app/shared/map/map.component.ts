import { Component, OnInit, PLATFORM_ID, Output, EventEmitter, OnChanges, SimpleChanges, Input, inject } from '@angular/core';
import { MapService } from './map.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeafletMouseEvent } from 'leaflet';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [FormsModule, CommonModule],
})
export class MapComponent implements OnInit, OnChanges {
  private mapService = inject(MapService);
  private platformId = inject(PLATFORM_ID);

  private map: L.Map | null = null;
  L: typeof import('leaflet') | null = null;
  private currentMarker: L.Marker | null = null;
  searchQuery = '';

  @Input() latitude = 0;
  @Input() longitude = 0;
  @Input() readonly = false;
  @Output() coordinatesSelected = new EventEmitter<{ lat: number; lng: number }>();

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
    console.log(text);
    this.mapService.search(text).subscribe({
      next: (result) => {
        console.log(result);
        if (result.length === 0) {
          console.error('No location found.');
          return;
        }

        const lat = result[0].lat;
        const lon = result[0].lon;

        this.setMarker(lat || 0, lon || 0);
        this.coordinatesSelected.emit({ lat: lat || 0, lng: lon || 0 });
      },
      error: (err) => {
        console.error('Search error:', err);
      },
    });
  }

  registerOnClick(): void {
    this.map?.on('click', (e: LeafletMouseEvent) => {
      if (this.readonly) return;

      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      this.setMarker(lat, lng);
      this.coordinatesSelected.emit({ lat, lng });
    });
  }
}
