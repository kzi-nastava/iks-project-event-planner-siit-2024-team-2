import { Component, inject } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogActions, MatDialogContent, MatDialogTitle, MatDialogClose } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { signal, OnInit } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';


export interface InvitationItem {
  email: string;
  readonly editable: boolean;
}

@Component({
  selector: 'app-invitations-dialog',
  standalone: true,
  imports: [MatFormFieldModule, MatChipsModule, MatIconModule, MatDialogActions, 
    MatDialogContent, MatDialogTitle, MatDialogClose, MatButtonModule, NgIf, ReactiveFormsModule],
  templateUrl: './invitations-dialog.component.html',
  styleUrl: './invitations-dialog.component.css'
})
export class InvitationsDialogComponent implements OnInit {
  readonly dialog = inject(MatDialogRef<InvitationsDialogComponent>);
  readonly data = inject<InvitationItem[]>(MAT_DIALOG_DATA);

  // Invitations
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly invitations = signal<InvitationItem[]>([]);
  readonly announcer = inject(LiveAnnouncer);
  readonly emailFormControl = new FormControl('', [Validators.email]);
  readonly editFormControl = new FormControl('', [Validators.email]);
  editError = false;

  ngOnInit(): void {
    this.invitations.update(() => this.data);
  }

  // Invitations chip list
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value && this.emailFormControl.valid) {
      this.invitations.update(emails => [...emails, { email: value, editable: true }]);
      event.chipInput!.clear();
      this.emailFormControl.reset();
    } else 
      this.emailFormControl.markAsTouched();
    console.log(this.emailFormControl.invalid);
  }

  remove(invitation: InvitationItem): void {
    if (!invitation.editable)
      return;
    this.invitations.update(emails => {
      const index = emails.indexOf(invitation);
      if (index < 0)
        return emails;

      emails.splice(index, 1);
      this.announcer.announce(`Removed ${invitation.email}`);
      return [...emails];
    });
  }

  edit(invitation: InvitationItem, event: MatChipEditedEvent) {
    if (!invitation.editable)
      return;
    const value = event.value.trim();

    // Remove invitation if empty
    if (!value) {
      this.remove(invitation);
      return;
    }

    // Check if the email is valid
    this.editFormControl.setValue(value);
    if (this.editFormControl.invalid) {
      this.announcer.announce('Not a valid email address.');
      return;
    }
    else
      this.editFormControl.reset();

    // Edit existing invitation
    this.invitations.update(invitations => {
      const index = invitations.indexOf(invitation);
      if (index >= 0) {
        invitations[index].email = value;
        return [...invitations];
      }
      return invitations;
    });
  }

  isInvalidChip(invitation: InvitationItem): boolean {
    return this.editFormControl.value == invitation.email 
            && this.editFormControl.invalid 
            && this.editFormControl.touched
  }

  apply() {
    this.dialog.close(this.invitations());
  }
}
