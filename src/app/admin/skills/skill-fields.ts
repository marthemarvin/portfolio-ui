import { CrudField } from '../../shared/crud-form/crud-form.component';
import { CrudColumn } from '../../shared/crud-page/crud-page.component';
import { Skill } from './skill';

// The fields in the add / edit skill pop-up, in order.
export const skillFields: CrudField[] = [
  { name: 'name', label: 'Name', type: 'text', required: true },
  { name: 'category', label: 'Category', type: 'text', required: true, placeholder: 'e.g. Backend, Database' },
  { name: 'icon', label: 'Icon URL', type: 'url' },
  { name: 'displayOrder', label: 'Order in its category (lowest first)', type: 'number' },
  { name: 'isActive', label: 'Show on portfolio', type: 'checkbox', default: true }
];

// The columns in the admin table.
export const skillColumns: CrudColumn[] = [
  { label: 'Name', value: (s: Skill) => s.name },
  { label: 'Category', value: (s: Skill) => s.category },
  { label: 'Order', value: (s: Skill) => s.displayOrder?.toString() },
  { label: 'Status', value: (s: Skill) => s.isActive ? 'Active' : 'Hidden' }
];
