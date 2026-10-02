import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  // Add a line here for each new section.
  sections = [
    { label: 'About', path: 'about' },
    { label: 'Experience', path: 'experience' },
    { label: 'Skills', path: 'skills' },
    { label: 'Certificates', path: 'certificates' },
    { label: 'Courses', path: 'courses' },
    { label: 'Messages', path: 'messages' }
  ];

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
