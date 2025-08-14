import { Component, inject } from '@angular/core';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { signal } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';

interface Invitation {
  email: string;
  readonly editable: boolean;
}

@Component({
  selector: 'app-invitations-dialog',
  standalone: true,
  imports: [ MatFormFieldModule, MatChipsModule, MatIconModule ],
  templateUrl: './invitations-dialog.component.html',
  styleUrl: './invitations-dialog.component.css'
})
export class InvitationsDialogComponent {
  readonly dialog = inject(MatDialogRef<InvitationsDialogComponent>);
  readonly data = inject<string[]>(MAT_DIALOG_DATA);

  // Invitations
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly invitations = signal<Invitation[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  ngOnInit(): void {
    this.invitations.update(invitations => {
      return this.data.map(email => ({ email: email, editable: false }));
    });
  }

  // Invitations chip list
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.invitations.update(emails => [...emails, { email: value, editable: true }]);
    }
    event.chipInput!.clear();
  }

  remove(invitation: Invitation): void {
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

  edit(invitation: Invitation, event: MatChipEditedEvent) {
    if (!invitation.editable)
      return;
    const value = event.value.trim();

    // Remove invitation if empty
    if (!value) {
      this.remove(invitation);
      return;
    }

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
}
