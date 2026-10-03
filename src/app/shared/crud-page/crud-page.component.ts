import { Component, ElementRef, Input, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { CrudField, CrudFormComponent } from '../crud-form/crud-form.component';
import { CrudService } from '../crud.service';
import { ModalComponent } from '../modal/modal.component';
import { Page } from '../page';
import { PageHeaderComponent } from '../page-header/page-header.component';
import { PagerComponent } from '../pager/pager.component';

// One column of the table. The first column is also used as the item's name ("Delete “…”?").
export interface CrudColumn {
  label: string;
  value: (item: any) => string | null | undefined;
}

type Item = { id: number };

// A whole admin section: table with Edit / Delete, an "Add" button, the add / edit pop-up and paging.
// With `reorderable`, rows get a handle to drag them (or move them with the arrow keys); the new order is saved at once.
@Component({
  selector: 'app-crud-page',
  standalone: true,
  imports: [PageHeaderComponent, PagerComponent, ModalComponent, CrudFormComponent, CdkDropList, CdkDrag, CdkDragHandle],
  templateUrl: './crud-page.component.html'
})
export class CrudPageComponent implements OnInit {
  @Input({ required: true }) title = '';
  @Input({ required: true }) itemName = '';
  @Input({ required: true }) service!: CrudService<any, any>;
  @Input({ required: true }) fields: CrudField[] = [];
  @Input({ required: true }) columns: CrudColumn[] = [];
  @Input() reorderable = false;
  // Rows can only be moved among rows of the same group, e.g. skills within their category.
  @Input() groupBy: ((item: any) => string) | null = null;

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private host = inject(ElementRef<HTMLElement>);

  page: Page<Item> | null = null;
  error = '';

  // The pop-up is open while formOpen is true; `selected` is the item being edited, or null when adding.
  formOpen = false;
  selected: Item | null = null;

  ngOnInit(): void {
    // Load in the browser only; the server has no token.
    if (this.isBrowser) {
      this.load(0);
    }
  }

  load(pageNumber: number): void {
    this.error = '';
    this.service.list(pageNumber).subscribe({
      next: page => this.page = page,
      error: () => this.error = `Couldn’t load ${this.title.toLowerCase()}. Refresh the page to try again.`
    });
  }

  openForm(item: Item | null): void {
    this.selected = item;
    this.formOpen = true;
  }

  // Passed to the form: update the selected item, or create a new one.
  saveItem = (body: Record<string, unknown>) =>
    this.selected ? this.service.update(this.selected.id, body) : this.service.create(body);

  closeForm(): void {
    this.formOpen = false;
  }

  onSaved(): void {
    this.closeForm();
    this.load(this.page?.number ?? 0);
  }

  // The floating copy of a dragged table row loses the table's column widths, so give it the real ones.
  matchPreviewWidths(): void {
    const host = this.host.nativeElement;
    const preview = host.querySelector('tr.cdk-drag-preview') as HTMLTableRowElement | null;
    const placeholder = host.querySelector('tr.cdk-drag-placeholder') as HTMLTableRowElement | null;
    if (!preview || !placeholder) {
      return;
    }
    Array.from(placeholder.cells).forEach((cell, i) => {
      const previewCell = preview.cells[i];
      if (previewCell) {
        previewCell.style.width = `${cell.getBoundingClientRect().width}px`;
      }
    });
  }

  // Drag and drop: the row was dropped at a new place.
  drop(event: CdkDragDrop<Item[]>): void {
    this.move(event.previousIndex, event.currentIndex);
  }

  // Keyboard: arrow up / down on a row's handle moves it one place, staying inside its group.
  moveByKey(event: Event, index: number, step: -1 | 1): void {
    event.preventDefault();
    const items = this.page!.content;
    const target = index + step;
    if (target < 0 || target >= items.length || !this.sameGroup(items[index], items[target])) {
      return;
    }
    const id = items[index].id;
    this.move(index, target);
    // Moving the row drops keyboard focus, so put it back on the same row's handle.
    setTimeout(() => this.host.nativeElement.querySelector(`[data-handle-for="${id}"]`)?.focus());
  }

  // Passed to the drop list: a row may only be dropped where its group is.
  canDropAt = (index: number, drag: CdkDrag<Item>): boolean =>
    this.sameGroup(drag.data, this.page!.content[index]);

  private sameGroup(a: Item, b: Item): boolean {
    return !this.groupBy || this.groupBy(a) === this.groupBy(b);
  }

  // Moves the row on screen straight away, then saves the order of this page.
  // Positions continue from earlier pages (page 2 starts at 20), so items on other pages keep their place.
  private move(from: number, to: number): void {
    if (from === to) {
      return;
    }
    const page = this.page!;
    moveItemInArray(page.content, from, to);
    const first = page.number * page.size;
    const order = page.content.map((item, i) => ({ id: item.id, position: first + i }));
    this.error = '';
    this.service.reorder(order).subscribe({
      error: () => {
        // Reload to put the rows back as they are saved, then show the message (load() clears old messages).
        this.load(page.number);
        this.error = 'Couldn’t save the new order. Try again.';
      }
    });
  }

  remove(item: Item): void {
    const name = this.columns[0].value(item);
    if (!confirm(`Delete “${name}”?`)) {
      return;
    }
    this.service.delete(item.id).subscribe({
      next: () => {
        const current = this.page!;
        // Step back a page when the last item on it was deleted.
        this.load(current.content.length === 1 && current.number > 0 ? current.number - 1 : current.number);
      },
      error: () => this.error = `Couldn’t delete “${name}”. Try again.`
    });
  }
}
