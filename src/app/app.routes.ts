import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { CourseListComponent } from './admin/courses/course-list/course-list.component';
import { CourseFormComponent } from './admin/courses/course-form/course-form.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Sign in' },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      { path: 'courses', component: CourseListComponent, title: 'Courses' },
      { path: 'courses/new', component: CourseFormComponent, title: 'Add course' },
      { path: 'courses/:id', component: CourseFormComponent, title: 'Edit course' }
    ]
  }
];
