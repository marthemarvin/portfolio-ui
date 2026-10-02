import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CrudService } from '../../shared/crud.service';
import { Skill, SkillRequest } from './skill';

@Injectable({ providedIn: 'root' })
export class SkillService extends CrudService<Skill, SkillRequest> {
  constructor() {
    super('skills', ['category,asc', 'displayOrder,asc']);
  }

  // Public list for the Skills page: only skills marked "Show on portfolio", sorted by category then order.
  listPublic(): Observable<Skill[]> {
    return this.http.get<Skill[]>(`${environment.apiUrl}/api/skills`);
  }
}
