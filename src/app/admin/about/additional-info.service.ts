import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CrudService } from '../../shared/crud.service';
import { Page } from '../../shared/page';
import { AdditionalInfo, AdditionalInfoRequest } from './about';

// Additional info items shown under the About page, managed at /api/admin/about/additional-info.
@Injectable({ providedIn: 'root' })
export class AdditionalInfoService extends CrudService<AdditionalInfo, AdditionalInfoRequest> {
  constructor() {
    super('about/additional-info');
  }

  // The backend returns every item in display order (no paging, there are only a few), so wrap it as a single page.
  override list(): Observable<Page<AdditionalInfo>> {
    return this.http.get<AdditionalInfo[]>(`${environment.apiUrl}/api/admin/about/additional-info`).pipe(
      map(items => ({ content: items, number: 0, size: items.length, totalPages: 1, totalElements: items.length }))
    );
  }
}
