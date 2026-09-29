import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ModalComponent } from '../../../shared/modal/modal.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { PagerComponent } from '../../../shared/pager/pager.component';
import { Page } from '../../../shared/page';
import { Course } from '../course';
import { CourseFormComponent } from '../course-form/course-form.component';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [PageHeaderComponent, PagerComponent, ModalComponent, CourseFormComponent],
  templateUrl: './course-list.component.html'
})
export class CourseListComponent implements OnInit {
  private courses = inject(CourseService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  page: Page<Course> | null = null;
  error = '';

  // The pop-up is open while formOpen is true; `selected` is the course being edited, or null when adding.
  formOpen = false;
  selected: Course | null = null;

  ngOnInit(): void {
    // Load in the browser only; the server has no token.
    if (this.isBrowser) {
      this.load(0);
    }
  }

  load(pageNumber: number): void {
    this.error = '';
    this.courses.list(pageNumber).subscribe({
      next: page => this.page = page,
      error: () => this.error = 'Couldn’t load courses. Refresh the page to try again.'
    });
  }

  openForm(course: Course | null): void {
    this.selected = course;
    this.formOpen = true;
  }

  closeForm(): void {
    this.formOpen = false;
  }

  onSaved(): void {
    this.closeForm();
    // New courses appear first, so go back to page 1 after adding.
    this.load(this.selected ? this.page?.number ?? 0 : 0);
  }

  remove(course: Course): void {
    if (!confirm(`Delete “${course.title}”?`)) {
      return;
    }
    this.courses.delete(course.id).subscribe({
      next: () => {
        const current = this.page!;
        // Step back a page when the last course on it was deleted.
        this.load(current.content.length === 1 && current.number > 0 ? current.number - 1 : current.number);
      },
      error: () => this.error = `Couldn’t delete “${course.title}”. Try again.`
    });
  }
}
