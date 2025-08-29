import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceService } from '../../services/service.service';
import { ServiceProductCategoryService } from '../../services/service-product-category.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/utils/toast-service';


@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
  entityName: string = '';
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<DeleteDialogComponent>,
    private serviceService: ServiceService, private spCategoryService: ServiceProductCategoryService,
    private toastService: ToastService, private router: Router) {
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
