import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CrudService } from '../../shared/crud.service';
import { ContactMessage, ContactMessageRequest } from './contact-message';

// Admin: list, open (mark as read) and delete messages. Public: send one from the Contact page.
@Injectable({ providedIn: 'root' })
export class ContactMessageService extends CrudService<ContactMessage, never> {
  constructor() {
    super('contact-messages');
  }

  markAsRead(id: number): Observable<ContactMessage> {
    return this.http.put<ContactMessage>(`${environment.apiUrl}/api/admin/contact-messages/${id}/read`, null);
  }

  // Public, no token needed.
  send(body: ContactMessageRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/contact`, body);
  }
}
