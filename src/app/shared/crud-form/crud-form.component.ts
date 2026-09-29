import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrudService } from '../crud.service';
import { FormFieldComponent } from '../form-field/form-field.component';

// One field of the form. The form is built from a list of these.
export interface CrudField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'checkbox';
  required?: boolean;
  default?: string | boolean;
}

// Add form (no `item`) or edit form (`item` given) for any admin section.
// Saves through the section's CrudService, then emits `saved`.
@Component({
  selector: 'app-crud-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './crud-form.component.html'
})
export class CrudFormComponent implements OnInit {
  @Input({ required: true }) fields: CrudField[] = [];
  @Input({ required: true }) service!: CrudService<unknown, unknown>;
  @Input({ required: true }) itemName = '';
  @Input() item: { id: number } | null = null;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form = new FormGroup<Record<string, FormControl>>({});
  saving = false;
  error = '';

  ngOnInit(): void {
    const values = (this.item ?? {}) as Record<string, unknown>;
    for (const field of this.fields) {
      const empty = field.type === 'checkbox' ? false : '';
      const value = values[field.name] ?? field.default ?? empty;
      this.form.addControl(field.name, new FormControl(value, field.required ? Validators.required : null));
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.error = '';
    const body = this.form.getRawValue();
    const request = this.item ? this.service.update(this.item.id, body) : this.service.create(body);

    request.subscribe({
      next: () => this.saved.emit(),
      error: () => {
        this.saving = false;
        this.error = `Couldn’t save the ${this.itemName}. Try again.`;
      }
    });
  }

  errorFor(field: CrudField): string | null {
    const control = this.form.controls[field.name];
    return control.invalid && control.touched ? `${field.label} is required.` : null;
  }
}
