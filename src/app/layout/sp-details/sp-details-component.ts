import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from "@angular/material/card";
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceProductService } from '../../services/service-product/service-product.service';
import { ServiceService } from '../../services/service.service';
import { environment } from '../../../environments/environment';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sp-details',
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, CommonModule,
            MatCardModule, MatButtonModule, MatIconModule
  ],
  templateUrl: './sp-details-component.html',
  styleUrl: './sp-details-component.css'
})
export class SpDetailsComponent  implements OnInit {
  spId!: number;
  spData?: any;
  loading = true;
  error = '';
  isService = false;
  hasDuration = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceProductService: ServiceProductService,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const spId = params['id'];
      if (spId) {
        this.fetchSpData(spId);
        this.spId = Number(spId);
      }
    });
  }

  private fetchSpData(spId: number): void {
    this.serviceProductService.get(spId).subscribe({
      next: (sp: any) => {
        this.loading = false;
        if (sp.dtype == 'Service') {
          this.serviceService.getService(spId).subscribe(serviceData => {
            this.spData = serviceData;
            this.isService = true;
            if (this.spData.duration > 0) this.hasDuration = true; 
          })
        }
        else 
          this.spData = sp;
      },
      error: (err: any) => {
        this.error = 'Failed to load service/product details.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getImagePath(image: string): string {
    return environment.apiHost + 'api/images/' + image;
  }

  goToSpp(sppId: number) {
    this.router.navigate(['/profile'], { queryParams: { id: sppId }} );
  }

  goBack(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
}
