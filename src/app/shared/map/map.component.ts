import { Component, AfterViewInit, OnInit, PLATFORM_ID, Inject, Output, EventEmitter } from '@angular/core';
import { MapService } from './map.service';
import { isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-map',
  standalone: true,
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  imports: [FormsModule],
})
export class MapComponent implements AfterViewInit, OnInit {
  private map: any;
  L: any;
  private currentMarker: any;
  searchQuery: string = ''; // For binding to the input field

  @Output() coordinatesSelected = new EventEmitter<{ lat: number; lng: number }>();

  constructor(
    private mapService: MapService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const L = await import('leaflet');
      this.L = L;
      this.map = this.L.map('map', {
        center: [45.2396, 19.8227],
        zoom: 13,
      });

      const tiles = this.L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          minZoom: 3,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        }
      );
      tiles.addTo(this.map);
      this.registerOnClick();
    }

    // let DefaultIcon = this.L.icon({
    //   iconUrl: 'https://unpkg.com/leaflet@1.6.0/dist/images/marker-icon.png',
    // });
    // this.L.Marker.prototype.options.icon = DefaultIcon;
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
          console.error('No location found for the search query.');
          return;
        }
  
        const lat = result[0].lat;
        const lon = result[0].lon;
        if (this.currentMarker) {
          this.map.removeLayer(this.currentMarker);
        }
        this.coordinatesSelected.emit({ lat, lng: lon });
        this.currentMarker = this.L.marker([lat, lon])
          .addTo(this.map)
          .bindPopup(`Location: ${text}`)
          .openPopup();
  
        this.map.setView([lat, lon], 13);
      },
      error: (err) => {
        console.error('An error occurred during the search:', err);
      },
    });
  }
  

  registerOnClick(): void {
    this.map.on('click', (e: any) => {
      const coord = e.latlng;
      const lat = coord.lat;
      const lng = coord.lng;

      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
      }

      this.currentMarker = new this.L.Marker([lat, lng]).addTo(this.map);

      this.coordinatesSelected.emit({ lat, lng });

    });
  }

  ngAfterViewInit(): void {}
}
