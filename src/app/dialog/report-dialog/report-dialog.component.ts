import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogContent, MatDialogActions, MatDialogModule } from '@angular/material/dialog';
import { UserReportService } from '../../services/user/user-report.service';
import { UserReportDto } from '../../services/dtos/user/user-report.dto';
import { MatFormField, MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ToastService } from '../../services/utils/toast-service';
import { AuthService } from '../../services/auth-service.service';

export interface ReportDialogData {
  email: string;
  name: string;
}

@Component({
  selector: 'app-report-dialog',
  standalone: true,
  imports: [MatDialogContent, MatFormField, MatLabel, MatDialogActions, ReactiveFormsModule, FormsModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './report-dialog.component.html',
  styleUrl: './report-dialog.component.css'
})
export class ReportDialogComponent {

  reasonFormControl = new FormControl('');

  // Injected
  readonly data: ReportDialogData = inject<ReportDialogData>(MAT_DIALOG_DATA);
  readonly userReportService = inject(UserReportService);
  readonly dialogRef = inject(MatDialogRef);
  readonly toastService = inject(ToastService);
  readonly authService = inject(AuthService);

  readonly isLoggedIn = this.authService.isLoggedIn();

  onReport() {
    if (!this.reasonFormControl.value) return;
    let reportDto: UserReportDto = {reportedEmail: this.data.email, reason: this.reasonFormControl.value};
    this.userReportService.add(reportDto).subscribe({
      next: () => {
        this.dialogRef.close(true);
        this.toastService.show('Report sent successfully', 2000);
      },
      error: (err) => {
        console.error('Failed to report:', err);
        this.dialogRef.close(false);
        this.toastService.show('Failed to send report', 2000);
      }
    });
  }
}
