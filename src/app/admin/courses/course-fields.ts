import { CrudField } from '../../shared/crud-form/crud-form.component';

// The fields in the add / edit course pop-up, in order.
export const courseFields: CrudField[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'author', label: 'Author', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'link', label: 'Link', type: 'url' },
  { name: 'image', label: 'Image URL', type: 'url' },
  { name: 'isActive', label: 'Show on portfolio', type: 'checkbox', default: true }
];
