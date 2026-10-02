import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { Page } from '../../../shared/page';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { PagerComponent } from '../../../shared/pager/pager.component';
import { ContactMessage } from '../contact-message';
import { ContactMessageService } from '../contact-message.service';

// Messages sent from the Contact page. They can be opened and deleted, not added or edited,
// so this uses the shared pieces directly instead of app-crud-page.
@Component({
  selector: 'app-message-list',
  standalone: true,
  imports: [DatePipe, ModalComponent, PageHeaderComponent, PagerComponent],
  templateUrl: './message-list.component.html',
  styleUrl: './message-list.component.css'
})
export class MessageListComponent implements OnInit {
  private messages = inject(ContactMessageService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  page: Page<ContactMessage> | null = null;
  opened: ContactMessage | null = null;
  error = '';

  ngOnInit(): void {
    // Load in the browser only; the server has no token.
    if (this.isBrowser) {
      this.load(0);
    }
  }

  load(pageNumber: number): void {
    this.error = '';
    this.messages.list(pageNumber).subscribe({
      next: page => this.page = page,
      error: () => this.error = 'Couldn’t load messages. Refresh the page to try again.'
    });
  }

  open(message: ContactMessage): void {
    this.opened = message;
    if (!message.isRead) {
      this.messages.markAsRead(message.id).subscribe({
        next: () => message.isRead = true
      });
    }
  }

  // Opens the visitor's address in your email app, with "Re: <subject>" filled in.
  replyLink(message: ContactMessage): string {
    const subject = encodeURIComponent(`Re: ${message.subject || 'your message'}`);
    return `mailto:${message.email}?subject=${subject}`;
  }

  remove(message: ContactMessage): void {
    if (!confirm(`Delete the message from ${message.name}?`)) {
      return;
    }
    this.messages.delete(message.id).subscribe({
      next: () => {
        const current = this.page!;
        // Step back a page when the last message on it was deleted.
        this.load(current.content.length === 1 && current.number > 0 ? current.number - 1 : current.number);
      },
      error: () => this.error = `Couldn’t delete the message from ${message.name}. Try again.`
    });
  }
}
