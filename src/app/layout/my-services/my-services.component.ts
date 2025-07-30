import { Component, OnInit } from '@angular/core';
import { Service } from '../../model/service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';   
import { FormsModule } from '@angular/forms';
import { ServiceFilterDialogComponent } from '../../dialog/service-filter-dialog/service-filter-dialog.component';
import { ServiceService } from '../../services/service.service';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedModel } from '../../shared/model/paged-model';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

const pageSize = 12;
const imagesApi = "api/images/";

@Component({
  selector: 'app-my-services',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatProgressSpinner],
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css']
})
export class MyServicesComponent implements OnInit {

  totalElements: number = pageSize * 8; // this variable is reference, other two are for storing the value between switching
  serviceTotalElements: number = this.totalElements;
 
  constructor (public dialog: MatDialog, private router: Router, private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.fetchServices();
  }

  isLoading = true;
  myServices : Service[] = [];
  selectedTabIndex = 0;

  fetchServices(): void {
      this.isLoading = true;
      this.myServices = [];
      this.serviceService.getAll()
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
            next: (response : PagedModel<Service>) => {
              this.serviceTotalElements = response.page.totalElements;
  
              if (this.selectedTabIndex == 1)
                this.totalElements = response.page.totalElements;
              this.myServices = JSON.parse(JSON.stringify(response.content));
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

  openDialog(): void {
    this.dialog.open(DeleteDialogComponent);
  }

  navigateToEditService(serviceId: number): void {
    this.router.navigate(['/new-service'], { queryParams: { id: serviceId } });
  }

  convertImageUrls(array: Service[]) {
      array.forEach(element => {
        if (element.images.length != 0) // on the page my-services, only the first (cover) image will be loaded if there is one
          element.images[0] = environment.apiHost + imagesApi + element.images[0];
      });
    }
}
