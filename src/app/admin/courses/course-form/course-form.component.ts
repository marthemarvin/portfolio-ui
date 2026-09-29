import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldComponent } from '../../../shared/form-field/form-field.component';
import { Course } from '../course';
import { CourseService } from '../course.service';

// Adds a course, or edits `course` when one is passed in.
@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './course-form.component.html'
})
export class CourseFormComponent implements OnInit {
  private courses = inject(CourseService);

  @Input() course: Course | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

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
    if (this.course) {
      this.form.patchValue({
        title: this.course.title,
        author: this.course.author ?? '',
        description: this.course.description ?? '',
        link: this.course.link ?? '',
        image: this.course.image ?? '',
        isActive: this.course.isActive
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    const body = this.form.getRawValue();
    const request = this.course ? this.courses.update(this.course.id, body) : this.courses.create(body);

    request.subscribe({
      next: () => this.saved.emit(),
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
