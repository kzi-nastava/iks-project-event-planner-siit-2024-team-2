import { Component, inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceService } from '../../services/service.service';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/utils/toast-service';
import { ProductService } from '../../services/product.service';
import { ProfileService } from '../../services/profile.service';


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

  entityName = '';
  constructor() {
      const data = this.data;

      this.entityName = data.entityName || 'item';
     }

  close() {
    this.dialogRef.close();
  }

  service: any; 

  onConfirm(): void {
    // define different service depending on current url (page)
    const currentUrl = this.router.url;
    if (currentUrl == '/my-services')
      this.service = this.serviceService;
    else if (currentUrl == '/all-categories') {
      this.service = this.spCategoryService;
    }
    else if (currentUrl == '/my-products') {
      this.service = this.productService;
    }
    else if (currentUrl == '/profile') {
      this.service = this.profileService;
    }

    if (this.service) {
      this.service.delete(this.data.id).subscribe({
        next: () => {
          this.toastService.show('Deleted successfully!', 2000);
          this.dialogRef.close(true); // signal success to parent
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
