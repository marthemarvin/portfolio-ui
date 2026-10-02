import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CrudService } from '../../shared/crud.service';
import { Page } from '../../shared/page';
import { Certificate, CertificateRequest } from './certificate';

@Injectable({ providedIn: 'root' })
export class CertificateService extends CrudService<Certificate, CertificateRequest> {
  constructor() {
    super('certificates', 'issueDate,desc');
  }

  // Public list for the Certificates page: only entries marked "Show on portfolio", newest first, one page at a time.
  listPublic(page = 0, size = 10): Observable<Page<Certificate>> {
    return this.http.get<Page<Certificate>>(`${environment.apiUrl}/api/certificates`, { params: { page, size } });
  }
}
