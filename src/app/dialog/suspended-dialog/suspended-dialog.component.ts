import { Component, inject, OnInit } from '@angular/core';
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
export class SuspendedDialogComponent implements OnInit {
  suspendedFor = "";
  readonly data: SuspendedDialogData = inject<SuspendedDialogData>(MAT_DIALOG_DATA);

  ngOnInit(): void {
    const suspensionEnd = addDays(this.data.suspendedAt, 3);
    this.suspendedFor = intlFormatDistance(suspensionEnd, new Date(), {locale: 'en-US'});
  }
}
