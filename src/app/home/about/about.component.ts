import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { About } from '../../admin/about/about';
import { RichTextComponent } from '../../shared/rich-text/rich-text.component';
import { AboutService } from '../../admin/about/about.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RichTextComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements OnInit {
  private aboutService = inject(AboutService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  about: About | null = null;
  notSetUp = false;
  error = '';

  ngOnInit(): void {
    // Load in the browser so visitors always see the latest version.
    if (!this.isBrowser) {
      return;
    }
    this.aboutService.getPublic().subscribe({
      next: about => this.about = about,
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.notSetUp = true;
        } else {
          this.error = 'Couldn’t load this page. Refresh to try again.';
        }
      }
    });
  }
}
