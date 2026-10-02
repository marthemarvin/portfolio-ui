import { CrudField } from '../../shared/crud-form/crud-form.component';
import { CrudColumn } from '../../shared/crud-page/crud-page.component';
import { Experience } from './experience';

// The fields in the add / edit experience pop-up, in order.
export const experienceFields: CrudField[] = [
  { name: 'position', label: 'Position', type: 'text', required: true },
  { name: 'companyName', label: 'Company', type: 'text', required: true },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'startDate', label: 'Start date', type: 'date', required: true },
  { name: 'endDate', label: 'End date (leave empty if you work here now)', type: 'date' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'companyLogo', label: 'Company logo URL', type: 'url' },
  { name: 'companyLink', label: 'Company website', type: 'url' },
  { name: 'isActive', label: 'Show on portfolio', type: 'checkbox', default: true }
];

// The columns in the admin table.
export const experienceColumns: CrudColumn[] = [
  { label: 'Position', value: (e: Experience) => e.position },
  { label: 'Company', value: (e: Experience) => e.companyName },
  { label: 'Dates', value: (e: Experience) => `${e.startDate} – ${e.endDate ?? 'now'}` },
  { label: 'Status', value: (e: Experience) => e.isActive ? 'Active' : 'Hidden' }
];
