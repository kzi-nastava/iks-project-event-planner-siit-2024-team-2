import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceService } from '../../services/service.service';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/utils/toast-service';
import { BudgetService } from '../../services/budget.service';
import { ProductService } from '../../services/product.service';
import { ProfileService } from '../../services/profile.service';
import { Observable } from "rxjs";

export interface DeletableService {
    delete(id: number): Observable<void | boolean>;
}
@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {

  data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject<MatDialogRef<DeleteDialogComponent>>(MatDialogRef);
  private serviceService = inject(ServiceService);
  private spCategoryService = inject(ServiceProductCategoryService);
  private toastService = inject(ToastService);
  private router = inject(Router);
  private productService = inject(ProductService);
  private profileService = inject(ProfileService);
  private budgetService = inject(BudgetService);

  entityName = '';
  constructor() {
      const data = this.data;
      this.entityName = data.entityName || 'item';
     }

  close() {
    this.dialogRef.close();
  }

  onConfirm(): void {
    // define different service depending on current url (page)

    const serviceMap: Record<string, DeletableService> = {
      '/my-services': this.serviceService,
      '/all-categories': this.spCategoryService,
      '/my-products': this.productService,
      '/profile': this.profileService,
      '/budget': this.budgetService
    }
    
    const currentUrl = this.router.url;
    const service =
      Object.entries(serviceMap).find(([path]) => currentUrl.startsWith(path))?.[1];

    if (service) {
      service.delete(this.data.id).subscribe({
        next: () => {
          this.toastService.show('Deleted successfully!', 2000);
          this.dialogRef.close(true);
        },
        error: () => {
          this.toastService.show('Failed to delete!', 2000);
        }
      });
    }
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
