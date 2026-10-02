import { Component, Input, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
@Component({
  selector: 'app-crud-page',
  standalone: true,
  imports: [PageHeaderComponent, PagerComponent, ModalComponent, CrudFormComponent],
  templateUrl: './crud-page.component.html'
})
export class CrudPageComponent implements OnInit {
  @Input({ required: true }) title = '';
  @Input({ required: true }) itemName = '';
  @Input({ required: true }) service!: CrudService<any, any>;
  @Input({ required: true }) fields: CrudField[] = [];
  @Input({ required: true }) columns: CrudColumn[] = [];

  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

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
    // A new item may land on the first page, so go back there after adding.
    this.load(this.selected ? this.page?.number ?? 0 : 0);
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
