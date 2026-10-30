import { CrudField } from '../../shared/crud-form/crud-form.component';
import { CrudColumn } from '../../shared/crud-page/crud-page.component';
import { AdditionalInfo } from './about';

// The fields on the About page, in order.
export const aboutFields: CrudField[] = [
  { name: 'fullName', label: 'Full name', type: 'text' },
  { name: 'headline', label: 'Headline', type: 'text' },
  { name: 'bio', label: 'Bio', type: 'richtext' },
  { name: 'projectDescription', label: 'How I built this portfolio', type: 'richtext' },
  { name: 'image', label: 'Photo', type: 'image' },
  { name: 'location', label: 'Location', type: 'text' },
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'resumeLink', label: 'Résumé link', type: 'url' },
  { name: 'githubLink', label: 'GitHub link', type: 'url' },
  { name: 'linkedinLink', label: 'LinkedIn link', type: 'url' }
];

// The fields in the add / edit additional info pop-up, in order.
export const additionalInfoFields: CrudField[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'richtext' },
  { name: 'image', label: 'Image (optional)', type: 'image' },
  { name: 'isActive', label: 'Show on portfolio', type: 'checkbox', default: true }
];

// The columns in the additional info table.
export const additionalInfoColumns: CrudColumn[] = [
  { label: 'Title', value: (i: AdditionalInfo) => i.title },
  { label: 'Status', value: (i: AdditionalInfo) => i.isActive ? 'Active' : 'Hidden' }
];
