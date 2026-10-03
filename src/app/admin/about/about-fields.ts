import { CrudField } from '../../shared/crud-form/crud-form.component';

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
