import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Course } from '../../admin/courses/course';
import { CourseService } from '../../admin/courses/course.service';

@Component({
  selector: 'app-courses-section',
  standalone: true,
  templateUrl: './courses-section.component.html',
  styleUrl: './courses-section.component.css'
})
export class CoursesSectionComponent implements OnInit {
  private courseService = inject(CourseService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  courses: Course[] | null = null;
  error = '';

  ngOnInit(): void {
    // Load in the browser so visitors always see the latest courses, not the ones from the last build.
    if (this.isBrowser) {
      this.courseService.listPublic().subscribe({
        next: courses => this.courses = courses,
        error: () => this.error = 'Couldn’t load courses. Refresh the page to try again.'
      });
    }
  }
}
