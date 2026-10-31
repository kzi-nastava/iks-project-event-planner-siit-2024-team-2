import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Invitation } from '../../model/event/invitation';
import { InvitationDto } from '../../dto/event/invitation.dto';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  readonly apiUrl = `${environment.apiHost}api/invitations`;
  readonly httpClient = inject(HttpClient);
  
  getAll() {
    return this.httpClient.get<Invitation[]>(this.apiUrl);
  }

  get(id: number) {
    return this.httpClient.get<Invitation>(`${this.apiUrl}/${id}`);
  }

  update(invitation: InvitationDto, id: number) {
    return this.httpClient.put<Invitation>(`${this.apiUrl}/${id}`, invitation);
  }

  acceptInvitation(token: string) {
    return this.httpClient.post<Invitation>(`${this.apiUrl}/${token}/accept`, null);
  }
}
