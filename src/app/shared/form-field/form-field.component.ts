import { Component, Input } from '@angular/core';

// A label, the input you place inside it, and an optional error message.
@Component({
  selector: 'app-form-field',
  standalone: true,
  templateUrl: './form-field.component.html'
})
export class FormFieldComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) fieldId = '';
  @Input() error: string | null = null;
}
