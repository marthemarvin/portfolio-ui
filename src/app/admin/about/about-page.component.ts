import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CrudFormComponent } from '../../shared/crud-form/crud-form.component';
import { PageHeaderComponent } from '../../shared/page-header/page-header.component';
import { About, AboutRequest } from './about';
import { aboutFields } from './about-fields';
import { AboutService } from './about.service';

@Component({
  selector: 'app-about-page',
  standalone: true,
  imports: [PageHeaderComponent, CrudFormComponent],
  templateUrl: './about-page.component.html'
})
export class AboutPageComponent implements OnInit {
  private aboutService = inject(AboutService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  fields = aboutFields;
  about: About | null = null;
  loaded = false;
  saved = false;
  error = '';

  ngOnInit(): void {
    // Load in the browser only; the server has no token.
    if (!this.isBrowser) {
      return;
    }
    this.aboutService.get().subscribe({
      next: about => {
        this.about = about;
        this.loaded = true;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.loaded = true; // Nothing saved yet: start with an empty form.
        } else {
          this.error = 'Couldn’t load your About details. Refresh the page to try again.';
        }
      }
    });
  }

  // Passed to the form.
  saveAbout = (body: Record<string, unknown>) => {
    this.saved = false;
    return this.aboutService.save(body as AboutRequest);
  };
}
