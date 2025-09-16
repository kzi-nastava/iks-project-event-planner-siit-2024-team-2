import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';   
import { FormsModule } from '@angular/forms';
import { ServiceFilterDialogComponent } from '../../dialog/service-filter-dialog/service-filter-dialog.component';
import { ServiceService } from '../../services/service-product/service.service';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ServiceCardDto } from '../../dto/service-product/service-card-dto.dto';
import { HttpErrorResponse } from '@angular/common/http';
import { ServiceProductService } from '../../services/service-product/service-product.service';
import { ServiceProductSummaryDto } from '../../dto/service-product/service-product-summary.dto';

const imagesApi = "api/images/";

@Component({
  selector: 'app-my-services',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatProgressSpinner],
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css']
})
export class MyServicesComponent implements OnInit {
  // Injected
  readonly serviceService = inject(ServiceService);
  readonly serviceProductService = inject(ServiceProductService);
  readonly dialog = inject(MatDialog);
  readonly router = inject(Router);

  ngOnInit(): void {
    this.fetchServices();
  }

  isLoading = true;
  myServices : ServiceCardDto[] = [];

  fetchServices(): void {
      this.isLoading = true;
      this.myServices = [];
      this.serviceService.getMine()
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({ 
          next: (response : ServiceCardDto[]) => {
            this.myServices = JSON.parse(JSON.stringify(response));
            this.convertImageUrls(this.myServices);
          },
          error: (err: HttpErrorResponse) => {
            console.error('Failed to load Services:', err);
          }
        });
    }

  openFilterDialog(): void {
  const dialogRef = this.dialog.open(ServiceFilterDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { category, eventTypes, minPrice, maxPrice, available } = result;
        console.log(result)
        const categories = category ? [category] : []; // "", categories, available, minPrice, maxPrice, eventTypes
        this.serviceService.getMyServiceCards(0, 10, '', categories, available, minPrice, maxPrice, eventTypes).subscribe((services) => {
          this.myServices = services.content.map(this.mapToServiceCard)
          this.convertImageUrls(this.myServices);
        });
      }
    });
  }

  mapToServiceCard(dto: ServiceProductSummaryDto): ServiceCardDto {
  return {
    id: dto.id || 0,
    name: dto.name,
    description: dto.description,
    discount: dto.discount,
    price: dto.price,
    image: dto.image,
  };
}

  openDialog(serviceId: number): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: { id: serviceId }
    });
    dialogRef.afterClosed().subscribe(result => {
    if (result === true) {
      // Instantly remove from the UI list
      this.myServices = this.myServices.filter(s => s.id !== serviceId);
    }
  });

  }

  navigateToEditService(serviceId: number): void {
    this.router.navigate(['/new-service'], { queryParams: { id: serviceId } });
  }

  convertImageUrls(array: ServiceCardDto[]) {
    array.forEach(element => {
      if (element.image != null) // on the page my-services, only the first (cover) image will be loaded if there is one
        element.image = environment.apiHost + imagesApi + element.image;
    });
  }

  showPriceList() {
    this.router.navigate(['/price-list']);
  }
}
