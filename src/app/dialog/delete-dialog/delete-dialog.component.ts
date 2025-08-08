import { Component, Inject } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ServiceService } from '../../services/service.service';
import { ToastService } from '../../services/toast-service';


@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule],
  templateUrl: './delete-dialog.component.html',
  styleUrl: './delete-dialog.component.css'
})
export class DeleteDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: number }, private dialogRef: MatDialogRef<DeleteDialogComponent>,
    private serviceService: ServiceService, private toastService: ToastService) { }

  close() {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.serviceService.delete(this.data.id).subscribe({
      next: () => {
        this.toastService.show('Deleted successfully!', 2000);
        this.dialogRef.close(true); // signal success to parent
      },
      error: () => {
        this.toastService.show('Failed to delete!', 2000);
      }
    });
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
