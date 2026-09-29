import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CrudService } from '../../shared/crud.service';
import { Course, CourseRequest } from './course';

@Injectable({ providedIn: 'root' })
export class CourseService extends CrudService<Course, CourseRequest> {
  constructor() {
    super('courses');
  }

  // Public list for the main page: only courses marked "Show on portfolio". No token needed.
  listPublic(): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.apiUrl}/api/courses`);
  }
}
