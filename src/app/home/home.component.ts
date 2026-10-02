import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

// The public site: top bar with page links, and the current page below it.
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  // Add a line here for each new page, and a route in app.routes.ts.
  pages = [
    { label: 'About', path: '/' },
    { label: 'Experience', path: '/experience' },
    { label: 'Courses', path: '/courses' }
  ];
}
