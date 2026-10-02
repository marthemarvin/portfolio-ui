import { CrudField } from '../../shared/crud-form/crud-form.component';
import { CrudColumn } from '../../shared/crud-page/crud-page.component';
import { Course } from './course';

// The fields in the add / edit course pop-up, in order.
export const courseFields: CrudField[] = [
  { name: 'title', label: 'Title', type: 'text', required: true },
  { name: 'author', label: 'Author', type: 'text' },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'link', label: 'Link', type: 'url' },
  { name: 'image', label: 'Image', type: 'image' },
  { name: 'isActive', label: 'Show on portfolio', type: 'checkbox', default: true }
];

// The columns in the admin table.
export const courseColumns: CrudColumn[] = [
  { label: 'Title', value: (course: Course) => course.title },
  { label: 'Author', value: (course: Course) => course.author },
  { label: 'Status', value: (course: Course) => course.isActive ? 'Active' : 'Hidden' }
];
