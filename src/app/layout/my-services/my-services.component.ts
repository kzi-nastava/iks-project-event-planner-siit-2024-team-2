import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';   
import { FormsModule } from '@angular/forms';
import { ServiceFilterDialogComponent } from '../../dialog/service-filter-dialog/service-filter-dialog.component';
import { ServiceService } from '../../services/service.service';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { ServiceCardDto } from '../../services/dtos/service-card-dto.dto';

const imagesApi = "api/images/";

@Component({
  selector: 'app-my-services',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatProgressSpinner],
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css']
})
export class MyServicesComponent implements OnInit {

  constructor (public dialog: MatDialog, private router: Router, private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.fetchServices();
  }

  isLoading = true;
  myServices : ServiceCardDto[] = [];

  fetchServices(): void {
      this.isLoading = true;
      this.myServices = [];
      this.serviceService.getAllCards()
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (response : ServiceCardDto[]) => {
            this.myServices = JSON.parse(JSON.stringify(response));
            this.convertImageUrls(this.myServices);
          },
          error: (err: any) => {
            console.error('Failed to load Services:', err);
          }
        });
    }

  openFilterDialog(): void {
  const dialogRef = this.dialog.open(ServiceFilterDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    console.log('The dialog was closed');
    // Here you can handle the selected filters if needed
    });
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
}
