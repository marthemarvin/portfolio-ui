import { Component, inject } from '@angular/core';
import { CrudPageComponent } from '../../../shared/crud-page/crud-page.component';
import { courseColumns, courseFields } from '../course-fields';
import { CourseService } from '../course.service';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CrudPageComponent],
  templateUrl: './course-list.component.html'
})
export class CourseListComponent {
  courses = inject(CourseService);
  fields = courseFields;
  columns = courseColumns;
}
