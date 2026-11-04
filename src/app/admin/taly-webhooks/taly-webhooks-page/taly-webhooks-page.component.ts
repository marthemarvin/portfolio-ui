import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { TalyWebhook } from '../taly-webhook';
import { TalyWebhookService } from '../taly-webhook.service';

// Read-only: the Taly webhooks received by the test merchant endpoint.
@Component({
  selector: 'app-taly-webhooks-page',
  standalone: true,
  imports: [DatePipe, PageHeaderComponent],
  templateUrl: './taly-webhooks-page.component.html',
  styleUrl: './taly-webhooks-page.component.css'
})
export class TalyWebhooksPageComponent implements OnInit {
  private talyWebhooks = inject(TalyWebhookService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  webhooks: TalyWebhook[] | null = null;
  error = '';

  ngOnInit(): void {
    // Load in the browser only; the server has no token.
    if (this.isBrowser) {
      this.talyWebhooks.list().subscribe({
        next: page => this.webhooks = page.content,
        error: () => this.error = 'Couldn’t load the webhooks. Refresh the page to try again.'
      });
    }
  }
}
