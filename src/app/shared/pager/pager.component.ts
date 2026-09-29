import { Component, EventEmitter, Input, Output } from '@angular/core';

// Previous / next buttons. `page` is zero-based, like Spring's.
@Component({
  selector: 'app-pager',
  standalone: true,
  templateUrl: './pager.component.html'
})
export class PagerComponent {
  @Input({ required: true }) page = 0;
  @Input({ required: true }) totalPages = 0;
  @Output() pageChange = new EventEmitter<number>();
}
