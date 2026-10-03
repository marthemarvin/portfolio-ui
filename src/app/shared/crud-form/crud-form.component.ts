import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { QuillEditorComponent, QuillModules } from 'ngx-quill';
import { FormFieldComponent } from '../form-field/form-field.component';

// One field of the form. The form is built from a list of these.
export interface CrudField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'richtext' | 'url' | 'email' | 'date' | 'number' | 'checkbox' | 'image';
  required?: boolean;
  default?: string | boolean;
  placeholder?: string;
  maxLength?: number;
}

// Fields that take the whole width when the form shows two columns.
const FULL_WIDTH_TYPES: CrudField['type'][] = ['textarea', 'richtext', 'image', 'checkbox'];

// Toolbar of rich text fields: heading, bold / italic / underline, lists, link, clear formatting.
const RICH_TEXT_TOOLBAR: QuillModules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean']
  ]
};

// Largest image you can upload, before base64 makes it about a third bigger.
const MAX_IMAGE_MB = 5;

// A form built from a list of fields (admin sections and the public contact form).
// `value` fills it in (leave it out for an empty form). `saveWith` does the API call; then `saved` is emitted.
//
// Rich text fields are edited with a Word-like toolbar (ngx-quill) and saved as HTML.
// Image fields: the control holds the current image URL. A newly chosen file is read as a base64 data URI
// and sent as `<name>Base64` (e.g. imageBase64); the backend uploads it and returns the new URL.
// When no new file is chosen only the URL is sent, so the backend keeps the current image.
@Component({
  selector: 'app-crud-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, QuillEditorComponent],
  templateUrl: './crud-form.component.html'
})
export class CrudFormComponent implements OnInit {
  @Input({ required: true }) fields: CrudField[] = [];
  @Input({ required: true }) saveWith!: (body: Record<string, unknown>) => Observable<unknown>;
  @Input({ required: true }) saveLabel = '';
  @Input() value: object | null = null;
  @Input() showCancel = true;
  // Two columns on wide screens: short fields side by side, long ones across the whole width.
  @Input() wide = false;
  @Input() busyLabel = 'Saving…';
  @Input() errorText = 'Couldn’t save. Try again.';
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  richTextModules = RICH_TEXT_TOOLBAR;

  form = new FormGroup<Record<string, FormControl>>({});
  saving = false;
  error = '';

  // New images chosen in this form, as base64 data URIs, by field name.
  newImages: Record<string, string> = {};
  imageErrors: Record<string, string> = {};

  ngOnInit(): void {
    const values = (this.value ?? {}) as Record<string, unknown>;
    for (const field of this.fields) {
      const empty = field.type === 'checkbox' ? false : '';
      let value = values[field.name] ?? field.default ?? empty;
      if (field.type === 'richtext' && typeof value === 'string') {
        value = plainTextToHtml(value);
      }
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
      } else if (field.type === 'image') {
        body[field.name] = value || null;
        body[field.name + 'Base64'] = this.newImages[field.name] ?? null;
      }
    }

    this.saveWith(body).subscribe({
      next: result => {
        this.saving = false;
        this.useSavedImages(result);
        this.saved.emit();
      },
      error: () => {
        this.saving = false;
        this.error = this.errorText;
      }
    });
  }

  // Reads the chosen file as a base64 data URI. It is only sent when the form is saved.
  chooseImage(field: CrudField, event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    delete this.imageErrors[field.name];
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.imageErrors[field.name] = 'Choose an image file, like a PNG or JPG.';
      input.value = '';
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      this.imageErrors[field.name] = `Choose an image smaller than ${MAX_IMAGE_MB} MB.`;
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => this.newImages[field.name] = reader.result as string;
    reader.readAsDataURL(file);
  }

  removeImage(field: CrudField, input: HTMLInputElement): void {
    delete this.newImages[field.name];
    this.form.controls[field.name].setValue('');
    input.value = '';
  }

  // What to show in the preview: the newly chosen image, or the current one.
  imagePreview(field: CrudField): string | null {
    return this.newImages[field.name] || this.form.controls[field.name].value || null;
  }

  // After saving, the backend returns the uploaded image's URL. Keep it so a second save doesn't upload again.
  private useSavedImages(result: unknown): void {
    const saved = (result ?? {}) as Record<string, unknown>;
    for (const field of this.fields) {
      if (field.type === 'image' && typeof saved[field.name] === 'string') {
        this.form.controls[field.name].setValue(saved[field.name]);
        delete this.newImages[field.name];
      }
    }
  }

  isFullWidth(field: CrudField): boolean {
    return FULL_WIDTH_TYPES.includes(field.type);
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

// Text saved before rich text existed has no HTML. Turn it into paragraphs so the editor keeps its layout:
// blank lines start a new paragraph, and a block of lines starting with "- " becomes a bulleted list.
function plainTextToHtml(text: string): string {
  if (!text.trim() || /<[a-z][\s\S]*>/i.test(text)) {
    return text;
  }
  const escape = (line: string) =>
    line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return text.trim().split(/\n\s*\n/).map(block => {
    const lines = block.split('\n').map(line => line.trim()).filter(Boolean);
    if (lines.every(line => /^[-•*]\s+/.test(line))) {
      return '<ul>' + lines.map(line => `<li>${escape(line.replace(/^[-•*]\s+/, ''))}</li>`).join('') + '</ul>';
    }
    return `<p>${lines.map(escape).join('<br>')}</p>`;
  }).join('');
}
