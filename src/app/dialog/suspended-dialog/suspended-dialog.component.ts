import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { addDays, intlFormatDistance } from 'date-fns';

export interface SuspendedDialogData {
  suspendedAt: Date;
}

@Component({
  selector: 'app-suspended-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatButtonModule, MatDialogModule],
  templateUrl: './suspended-dialog.component.html',
  styleUrl: './suspended-dialog.component.css',
})
export class SuspendedDialogComponent {
  suspendedFor: string = "";
  readonly data: SuspendedDialogData = inject<SuspendedDialogData>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    let suspensionEnd = addDays(this.data.suspendedAt, 3);
    console.log(this.data.suspendedAt);
    console.log(suspensionEnd);
    console.log(new Date());
    this.suspendedFor = intlFormatDistance(suspensionEnd, new Date(), {locale: 'en-US'});
  }
}
