import { Component, Input } from '@angular/core';

// Page title with room for buttons on the right.
@Component({
  selector: 'app-page-header',
  standalone: true,
  templateUrl: './page-header.component.html'
})
export class PageHeaderComponent {
  @Input({ required: true }) title = '';
}
