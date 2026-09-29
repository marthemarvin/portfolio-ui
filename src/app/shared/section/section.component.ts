import { Component, Input } from '@angular/core';

// A section of the main page. `sectionId` is what the top bar links to (#courses).
@Component({
  selector: 'app-section',
  standalone: true,
  templateUrl: './section.component.html'
})
export class SectionComponent {
  @Input({ required: true }) sectionId = '';
  @Input({ required: true }) title = '';
}
