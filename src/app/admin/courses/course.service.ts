import { Injectable } from '@angular/core';
import { CrudService } from '../../shared/crud.service';
import { Course, CourseRequest } from './course';

@Injectable({ providedIn: 'root' })
export class CourseService extends CrudService<Course, CourseRequest> {
  constructor() {
    super('courses');
  }
}
