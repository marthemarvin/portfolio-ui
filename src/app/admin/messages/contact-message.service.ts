import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CrudService } from '../../shared/crud.service';
import { ContactMessage, ContactMessageRequest } from './contact-message';

// Admin: list, open (mark as read) and delete messages. Public: send one from the Contact page.
@Injectable({ providedIn: 'root' })
export class ContactMessageService extends CrudService<ContactMessage, never> {
  // How many messages are unread. Shown next to "Messages" in the sidebar; null until loaded.
  unread = signal<number | null>(null);

  constructor() {
    super('contact-messages');
  }

  // Loads the unread count. Called when the admin opens and after a message is opened or deleted.
  refreshUnread(): void {
    this.http.get<number>(`${environment.apiUrl}/api/admin/contact-messages/total-unread`).subscribe({
      next: count => this.unread.set(count),
      error: () => this.unread.set(null)
    });
  }

  markAsRead(id: number): Observable<ContactMessage> {
    return this.http.put<ContactMessage>(`${environment.apiUrl}/api/admin/contact-messages/${id}/read`, null);
  }

  // Public, no token needed.
  send(body: ContactMessageRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/api/contact`, body);
  }
}
