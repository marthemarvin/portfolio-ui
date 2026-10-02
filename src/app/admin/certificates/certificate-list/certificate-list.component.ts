import { Component, inject } from '@angular/core';
import { CrudPageComponent } from '../../../shared/crud-page/crud-page.component';
import { certificateColumns, certificateFields } from '../certificate-fields';
import { CertificateService } from '../certificate.service';

@Component({
  selector: 'app-certificate-list',
  standalone: true,
  imports: [CrudPageComponent],
  templateUrl: './certificate-list.component.html'
})
export class CertificateListComponent {
  certificates = inject(CertificateService);
  fields = certificateFields;
  columns = certificateColumns;
}
