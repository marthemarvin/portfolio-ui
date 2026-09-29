import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { Observable, tap } from 'rxjs';
import { environment } from '../environments/environment';

const TOKEN_KEY = 'portfolio.token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  // localStorage only exists in the browser, not during server-side rendering.
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  // The backend returns the JWT as plain text, not JSON, hence responseType: 'text'.
  login(email: string, password: string): Observable<string> {
    return this.http
      .post(`${environment.apiUrl}/api/auth/login`, { email, password }, { responseType: 'text' })
      .pipe(tap(token => this.isBrowser && localStorage.setItem(TOKEN_KEY, token)));
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem(TOKEN_KEY);
    }
  }

  getToken(): string | null {
    return this.isBrowser ? localStorage.getItem(TOKEN_KEY) : null;
  }
}
