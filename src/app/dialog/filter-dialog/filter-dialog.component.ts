import { Component } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog, MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-dialog',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, MatCheckbox],
  templateUrl: './filter-dialog.component.html',
  styleUrl: './filter-dialog.component.css'
})
export class FilterDialogComponent {

}
