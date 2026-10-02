import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { FormFieldComponent } from '../form-field/form-field.component';

// One field of the form. The form is built from a list of these.
export interface CrudField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'email' | 'date' | 'number' | 'checkbox';
  required?: boolean;
  default?: string | boolean;
  placeholder?: string;
  maxLength?: number;
}

// A form built from a list of fields (admin sections and the public contact form).
// `value` fills it in (leave it out for an empty form). `saveWith` does the API call; then `saved` is emitted.
@Component({
  selector: 'app-crud-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent],
  templateUrl: './crud-form.component.html'
})
export class CrudFormComponent implements OnInit {
  @Input({ required: true }) fields: CrudField[] = [];
  @Input({ required: true }) saveWith!: (body: Record<string, unknown>) => Observable<unknown>;
  @Input({ required: true }) saveLabel = '';
  @Input() value: object | null = null;
  @Input() showCancel = true;
  @Input() busyLabel = 'Saving…';
  @Input() errorText = 'Couldn’t save. Try again.';
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form = new FormGroup<Record<string, FormControl>>({});
  saving = false;
  error = '';

  ngOnInit(): void {
    const values = (this.value ?? {}) as Record<string, unknown>;
    for (const field of this.fields) {
      const empty = field.type === 'checkbox' ? false : '';
      const value = values[field.name] ?? field.default ?? empty;
      const validators: ValidatorFn[] = [];
      if (field.required) validators.push(Validators.required);
      if (field.type === 'email') validators.push(Validators.email);
      if (field.maxLength) validators.push(Validators.maxLength(field.maxLength));
      this.form.addControl(field.name, new FormControl(value, validators));
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
    // Empty date and number fields are sent as null; numbers are sent as numbers, not text.
    for (const field of this.fields) {
      const value = body[field.name];
      if ((field.type === 'date' || field.type === 'number') && (value === '' || value === null)) {
        body[field.name] = null;
      } else if (field.type === 'number') {
        body[field.name] = Number(value);
      }
    }

    this.saveWith(body).subscribe({
      next: () => {
        this.saving = false;
        this.saved.emit();
      },
      error: () => {
        this.saving = false;
        this.error = this.errorText;
      }
    });
  }

  errorFor(field: CrudField): string | null {
    const control = this.form.controls[field.name];
    if (!control.invalid || !control.touched) {
      return null;
    }
    if (control.hasError('required')) {
      return `${field.label} is required.`;
    }
    if (control.hasError('email')) {
      return 'Enter a valid email address, like name@example.com.';
    }
    return `${field.label} must be at most ${field.maxLength} characters.`;
  }
}
