import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Course } from '../../admin/courses/course';
import { CourseService } from '../../admin/courses/course.service';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './course-detail.component.html',
  styleUrl: './course-detail.component.css'
})
export class CourseDetailComponent implements OnInit {
  private courseService = inject(CourseService);
  private route = inject(ActivatedRoute);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  course: Course | null = null;
  notFound = false;
  error = '';

  ngOnInit(): void {
    // Load in the browser so visitors always see the latest version.
    if (!this.isBrowser) {
      return;
    }
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.courseService.getPublic(id).subscribe({
      next: course => this.course = course,
      error: (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.notFound = true;
        } else {
          this.error = 'Couldn’t load this course. Refresh the page to try again.';
        }
      }
    });
  }
}
