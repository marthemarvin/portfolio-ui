import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { DatePipe, DecimalPipe, isPlatformBrowser } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { ApiHit } from '../api-hit';
import { ApiHitService } from '../api-hit.service';

// Read-only: how often each public API endpoint has been called.
@Component({
  selector: 'app-audit-page',
  standalone: true,
  imports: [DatePipe, DecimalPipe, PageHeaderComponent],
  templateUrl: './audit-page.component.html',
  styleUrl: './audit-page.component.css'
})
export class AuditPageComponent implements OnInit {
  private apiHits = inject(ApiHitService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  hits: ApiHit[] | null = null;
  error = '';

  ngOnInit(): void {
    // Load in the browser only; the server has no token.
    if (this.isBrowser) {
      this.apiHits.list().subscribe({
        next: hits => this.hits = hits,
        error: () => this.error = 'Couldn’t load the audit. Refresh the page to try again.'
      });
    }
  }
}
