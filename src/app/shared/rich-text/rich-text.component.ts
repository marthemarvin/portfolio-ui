import { Component, Input } from '@angular/core';

// Shows text written in a rich text field. Older plain text (no HTML) keeps its line breaks.
// Angular cleans the HTML before showing it, so scripts and other unsafe content are removed.
@Component({
  selector: 'app-rich-text',
  standalone: true,
  templateUrl: './rich-text.component.html'
})
export class RichTextComponent {
  @Input({ required: true }) text = '';

  get isHtml(): boolean {
    return /<[a-z][\s\S]*>/i.test(this.text);
  }
}
