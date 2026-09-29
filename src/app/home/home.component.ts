import { Component } from '@angular/core';
import { SectionComponent } from '../shared/section/section.component';
import { CoursesSectionComponent } from './courses-section/courses-section.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SectionComponent, CoursesSectionComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Add a line here for each new section, and an <app-section> in the template.
  sections = [
    { id: 'courses', label: 'Courses' }
  ];
}
