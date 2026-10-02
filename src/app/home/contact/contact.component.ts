import { Component, inject } from '@angular/core';
import { CrudField, CrudFormComponent } from '../../shared/crud-form/crud-form.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { ContactMessageRequest } from '../../admin/messages/contact-message';
import { ContactMessageService } from '../../admin/messages/contact-message.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [PageHeaderComponent, CrudFormComponent],
  templateUrl: './contact.component.html'
})
export class ContactComponent {
  private messages = inject(ContactMessageService);

  sent = false;

  // Same rules as the backend's ContactMessageRequest.
  fields: CrudField[] = [
    { name: 'name', label: 'Name', type: 'text', required: true, maxLength: 255 },
    { name: 'email', label: 'Email', type: 'email', required: true, maxLength: 255 },
    { name: 'subject', label: 'Subject', type: 'text', maxLength: 255 },
    { name: 'message', label: 'Message', type: 'textarea', required: true, maxLength: 5000 }
  ];

  // Passed to the form.
  send = (body: Record<string, unknown>) => this.messages.send(body as ContactMessageRequest);
}
