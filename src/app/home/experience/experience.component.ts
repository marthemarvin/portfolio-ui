import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { PagerComponent } from '../../shared/pager/pager.component';
import { RichTextComponent } from '../../shared/rich-text/rich-text.component';
import { Page } from '../../shared/page';
import { Experience } from '../../admin/experiences/experience';
import { ExperienceService } from '../../admin/experiences/experience.service';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [PageHeaderComponent, PagerComponent, RichTextComponent, DatePipe],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.css'
})
export class ExperienceComponent implements OnInit {
  private experienceService = inject(ExperienceService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  page: Page<Experience> | null = null;
  error = '';

  ngOnInit(): void {
    // Load in the browser so visitors always see the latest version.
    if (this.isBrowser) {
      this.load(0);
    }
  }

  load(pageNumber: number): void {
    this.error = '';
    this.experienceService.listPublic(pageNumber).subscribe({
      next: page => this.page = page,
      error: () => this.error = 'Couldn’t load experience. Refresh the page to try again.'
    });
  }
}
