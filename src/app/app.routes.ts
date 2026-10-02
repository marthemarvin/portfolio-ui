import { Routes } from '@angular/router';
import { authGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './home/about/about.component';
import { CoursesComponent } from './home/courses/courses.component';
import { CourseDetailComponent } from './home/course-detail/course-detail.component';
import { ExperienceComponent } from './home/experience/experience.component';
import { CertificatesComponent } from './home/certificates/certificates.component';
import { SkillsComponent } from './home/skills/skills.component';
import { LoginComponent } from './login/login.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { CourseListComponent } from './admin/courses/course-list/course-list.component';
import { AboutPageComponent } from './admin/about/about-page.component';
import { ExperienceListComponent } from './admin/experiences/experience-list/experience-list.component';
import { CertificateListComponent } from './admin/certificates/certificate-list/certificate-list.component';
import { SkillListComponent } from './admin/skills/skill-list/skill-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: AboutComponent, title: 'About' },
      { path: 'experience', component: ExperienceComponent, title: 'Experience' },
      { path: 'skills', component: SkillsComponent, title: 'Skills' },
      { path: 'certificates', component: CertificatesComponent, title: 'Certificates' },
      { path: 'courses', component: CoursesComponent, title: 'Courses' },
      { path: 'courses/:id', component: CourseDetailComponent, title: 'Course' }
    ]
  },
  { path: 'login', component: LoginComponent, title: 'Sign in' },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full' },
      { path: 'about', component: AboutPageComponent, title: 'About' },
      { path: 'experience', component: ExperienceListComponent, title: 'Experience' },
      { path: 'skills', component: SkillListComponent, title: 'Skills' },
      { path: 'certificates', component: CertificateListComponent, title: 'Certificates' },
      { path: 'courses', component: CourseListComponent, title: 'Courses' }
    ]
  }
];
