import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from '../../shared/page';
import { TalyWebhook } from './taly-webhook';

@Injectable({ providedIn: 'root' })
export class TalyWebhookService {
  private http = inject(HttpClient);

  // The latest webhooks, newest first.
  list(): Observable<Page<TalyWebhook>> {
    return this.http.get<Page<TalyWebhook>>(`${environment.apiUrl}/api/admin/taly-webhooks?size=50`);
  }
}
