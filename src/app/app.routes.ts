import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './home/about/about.component';
import { CoursesComponent } from './home/courses/courses.component';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { CourseListComponent } from './admin/courses/course-list/course-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: AboutComponent, title: 'About' },
      { path: 'courses', component: CoursesComponent, title: 'Courses' }
    ]
  },
  { path: 'login', component: LoginComponent, title: 'Sign in' },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'courses', pathMatch: 'full' },
      { path: 'courses', component: CourseListComponent, title: 'Courses' }
    ]
  }
];
