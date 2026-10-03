import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiHit } from './api-hit';

@Injectable({ providedIn: 'root' })
export class ApiHitService {
  private http = inject(HttpClient);

  // Every counted endpoint, most called first.
  list(): Observable<ApiHit[]> {
    return this.http.get<ApiHit[]>(`${environment.apiUrl}/api/admin/stats`);
  }
}
