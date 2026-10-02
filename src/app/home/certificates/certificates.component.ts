import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { PagerComponent } from '../../shared/pager/pager.component';
import { Page } from '../../shared/page';
import { Certificate } from '../../admin/certificates/certificate';
import { CertificateService } from '../../admin/certificates/certificate.service';

@Component({
  selector: 'app-certificates',
  standalone: true,
  imports: [PageHeaderComponent, PagerComponent, DatePipe],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.css'
})
export class CertificatesComponent implements OnInit {
  private certificateService = inject(CertificateService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  page: Page<Certificate> | null = null;
  error = '';

  ngOnInit(): void {
    // Load in the browser so visitors always see the latest version.
    if (this.isBrowser) {
      this.load(0);
    }
  }

  load(pageNumber: number): void {
    this.error = '';
    this.certificateService.listPublic(pageNumber).subscribe({
      next: page => this.page = page,
      error: () => this.error = 'Couldn’t load certificates. Refresh the page to try again.'
    });
  }
}
