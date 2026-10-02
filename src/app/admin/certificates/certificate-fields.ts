import { CrudField } from '../../shared/crud-form/crud-form.component';
import { CrudColumn } from '../../shared/crud-page/crud-page.component';
import { Certificate } from './certificate';

// The fields in the add / edit certificate pop-up, in order.
export const certificateFields: CrudField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'issuer', label: 'Issuer', type: 'text', required: true },
  { name: 'issueDate', label: 'Issue date', type: 'date', required: true },
  { name: 'expiryDate', label: 'Expiry date (leave empty if it doesn’t expire)', type: 'date' },
  { name: 'credentialId', label: 'Credential ID', type: 'text' },
  { name: 'credentialUrl', label: 'Credential URL', type: 'url' },
  { name: 'image', label: 'Badge image', type: 'image' },
  { name: 'isActive', label: 'Show on portfolio', type: 'checkbox', default: true }
];

// The columns in the admin table.
export const certificateColumns: CrudColumn[] = [
  { label: 'Name', value: (c: Certificate) => c.name },
  { label: 'Issuer', value: (c: Certificate) => c.issuer },
  { label: 'Issued', value: (c: Certificate) => c.issueDate },
  { label: 'Status', value: (c: Certificate) => c.isActive ? 'Active' : 'Hidden' }
];
