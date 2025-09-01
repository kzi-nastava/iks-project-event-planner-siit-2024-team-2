import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions } from "@angular/material/card";
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceProductService } from '../../services/service-product/service-product.service';
import { ServiceService } from '../../services/service.service';
import { environment } from '../../../environments/environment';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ToastService } from '../../services/utils/toast-service';
import { AuthService } from '../../services/auth-service.service';
import { UserService } from '../../services/user/user.service';
import { Service } from '../../model/service-product/service';
import { ReportDialogComponent } from '../../dialog/report-dialog/report-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { ServiceProduct } from '../../model/service-product/service-product';
import { HttpErrorResponse } from '@angular/common/http';
import { BookReserveDialogComponent } from '../../dialog/book-reserve-dialog/book-reserve-dialog-component';

@Component({
  selector: 'app-sp-details',
  standalone: true,
  imports: [MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatCardActions, CommonModule,
    MatCardModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './sp-details-component.html',
  styleUrl: './sp-details-component.css'
})
export class SpDetailsComponent  implements OnInit {
  spId!: number;
  spData?: Service;
  loading = true;
  error = '';
  isService = false;
  hasDuration = false;

  // Injected
  readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  readonly serviceProductService = inject(ServiceProductService);
  readonly serviceService = inject(ServiceService);
  readonly toastService = inject(ToastService);
  readonly authService = inject(AuthService);
  readonly userService = inject(UserService);
  readonly dialog = inject(MatDialog);

  readonly isAdmin = this.authService.getUserRole() === 'ADMIN';

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
      next: (sp: ServiceProduct) => {
        this.loading = false;
        if (sp.dtype == 'Service') {
          this.serviceService.getService(spId).subscribe(serviceData => {
            this.spData = serviceData;
            this.isService = true;
            if ((this.spData.duration || 0) > 0) this.hasDuration = true; 
          })
        }
        else {
          this.spData = sp as Service;
          this.isService = false;
        }
      },
      error: (err: HttpErrorResponse) => {
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

  buyReserve() {
    this.dialog.open(BookReserveDialogComponent, {data: {sp: this.spData}});
  }

  openReportDialog() {
    const email = this.spData?.serviceProductProvider?.email || '';
    const name = this.spData?.serviceProductProvider?.firstName || '' + ' ' + this.spData?.serviceProductProvider?.lastName || '';
    this.dialog.open(ReportDialogComponent, {data: {email: email, name: name}});
  }
  
  suspendUser() {
    const email = this.spData?.serviceProductProvider?.email || '';
    this.userService.suspendUser(email).subscribe({
      next: () => {
        this.toastService.show('User suspended successfully', 2000);
      },
      error: (err) => {
        console.error('Failed to suspend user:', err);
        this.toastService.show('Failed to suspend user', 2000);
      }
    });
  }
}
