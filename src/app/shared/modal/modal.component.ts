import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

// A pop-up using the native <dialog>. Show it with @if; it opens as soon as it appears.
// Esc closes it and emits `closed`.
@Component({
  selector: 'app-modal',
  standalone: true,
  templateUrl: './modal.component.html'
})
export class ModalComponent implements AfterViewInit {
  @Input({ required: true }) title = '';
  @Output() closed = new EventEmitter<void>();

  @ViewChild('dialog') private dialog!: ElementRef<HTMLDialogElement>;

  ngAfterViewInit(): void {
    this.dialog.nativeElement.showModal();
  }
}
