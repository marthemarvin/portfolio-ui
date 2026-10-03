import { Component, OnInit, PLATFORM_ID, Signal, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth.service';
import { ContactMessageService } from '../messages/contact-message.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private messages = inject(ContactMessageService);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // Add a line here for each new section. `count` shows a number next to the link when it is above 0.
  sections: { label: string; path: string; count?: Signal<number | null> }[] = [
    { label: 'About', path: 'about' },
    { label: 'Experience', path: 'experience' },
    { label: 'Skills', path: 'skills' },
    { label: 'Certificates', path: 'certificates' },
    { label: 'Courses', path: 'courses' },
    { label: 'Messages', path: 'messages', count: this.messages.unread },
    { label: 'Audit', path: 'audit' }
  ];

  ngOnInit(): void {
    // Browser only; the server has no token.
    if (this.isBrowser) {
      this.messages.refreshUnread();
    }
  }

  signOut(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
