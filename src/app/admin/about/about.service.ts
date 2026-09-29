import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { About, AboutRequest } from './about';

// There is only one About record, so this has just get and save (no list, create or delete).
@Injectable({ providedIn: 'root' })
export class AboutService {
  private http = inject(HttpClient);
  private url = `${environment.apiUrl}/api/admin/about`;

  // 404 means nothing has been saved yet.
  get(): Observable<About> {
    return this.http.get<About>(this.url);
  }

  // Public version for the About page. No token needed; 404 means nothing has been saved yet.
  getPublic(): Observable<About> {
    return this.http.get<About>(`${environment.apiUrl}/api/about`);
  }

  // Creates the record the first time, updates it after that.
  save(body: AboutRequest): Observable<About> {
    return this.http.put<About>(this.url, body);
  }
}
