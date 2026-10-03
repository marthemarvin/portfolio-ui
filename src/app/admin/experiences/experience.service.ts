import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CrudService } from '../../shared/crud.service';
import { Page } from '../../shared/page';
import { Experience, ExperienceRequest } from './experience';

@Injectable({ providedIn: 'root' })
export class ExperienceService extends CrudService<Experience, ExperienceRequest> {
  constructor() {
    super('experiences', ['displayOrder,asc', 'id,asc']);
  }

  // Public list for the Experience page: only entries marked "Show on portfolio", newest first, one page at a time.
  listPublic(page = 0, size = 10): Observable<Page<Experience>> {
    return this.http.get<Page<Experience>>(`${environment.apiUrl}/api/experiences`, { params: { page, size } });
  }
}
