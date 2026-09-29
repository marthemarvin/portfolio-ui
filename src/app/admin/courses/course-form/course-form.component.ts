import { Component, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormFieldComponent } from '../../../shared/form-field/form-field.component';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';
import { CourseService } from '../course.service';

// Used for both /admin/courses/new and /admin/courses/:id.
@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FormFieldComponent, PageHeaderComponent],
  templateUrl: './course-form.component.html'
})
export class CourseFormComponent implements OnInit {
  private courses = inject(CourseService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  id = Number(this.route.snapshot.paramMap.get('id')) || null;

  form = inject(FormBuilder).nonNullable.group({
    title: ['', Validators.required],
    author: [''],
    description: [''],
    link: [''],
    image: [''],
    isActive: [true]
  });

  saving = false;
  error = '';

  ngOnInit(): void {
    // Load in the browser only; the server has no token.
    if (!this.id || !this.isBrowser) {
      return;
    }
    this.courses.get(this.id).subscribe({
      next: course => this.form.patchValue({
        title: course.title,
        author: course.author ?? '',
        description: course.description ?? '',
        link: course.link ?? '',
        image: course.image ?? '',
        isActive: course.isActive
      }),
      error: () => this.error = 'Couldn’t load this course. Go back to Courses and try again.'
    });
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    const body = this.form.getRawValue();
    const request = this.id ? this.courses.update(this.id, body) : this.courses.create(body);

    request.subscribe({
      next: () => this.router.navigate(['/admin/courses']),
      error: () => {
        this.saving = false;
        this.error = 'Couldn’t save the course. Try again.';
      }
    });
  }

  titleError(): string | null {
    const title = this.form.controls.title;
    return title.invalid && title.touched ? 'Enter a title.' : null;
  }
}
