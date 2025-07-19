import { Component, OnInit } from '@angular/core';
import { Service } from '../../model/service';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../../dialog/delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';   
import { FormsModule } from '@angular/forms';
import { ServiceFilterDialogComponent } from '../../dialog/service-filter-dialog/service-filter-dialog.component';
import { ServiceService } from '../../services/service.service';


@Component({
  selector: 'app-my-services',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule],
  templateUrl: './my-services.component.html',
  styleUrls: ['./my-services.component.css']
})
export class MyServicesComponent implements OnInit {
  myServices: Service[] = [];
  filterCategories: string[] = ['Price', 'Category', 'Available events', 'Availability'];

  constructor (public dialog: MatDialog, private router: Router, private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.serviceService.getAll().subscribe(data => {
      this.myServices = data.content;
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
}
