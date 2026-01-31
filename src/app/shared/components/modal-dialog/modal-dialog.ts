import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';

@Component({
  selector: 'app-modal-dialog',
  imports: [],
  templateUrl: './modal-dialog.html',
  styleUrl: './modal-dialog.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.role]': `'dialog'`,
    '[attr.aria-modal]': `'true'`,
    '[attr.aria-labelledby]': 'ariaLabelledBy()',
  },
})
export class ModalDialog {
  private readonly hostRef = inject(ElementRef<HTMLElement>);

  readonly open = input<boolean>(false);
  readonly title = input<string | null>(null);
  readonly closeOnBackdrop = input<boolean>(true);

  readonly closed = output<void>();

  readonly isOpen = signal(true);

  readonly ariaLabelledBy = computed(() => (this.title() ? 'modal-title' : null));

  constructor() {
    effect(() => {
      this.isOpen.set(this.open());
      if (this.open()) {
        queueMicrotask(() => this.focusFirstElement());
      }
    });
  }

  close(): void {
    this.isOpen.set(false);
    console.log('Modal closed1', this.isOpen());
    this.closed.emit();
    console.log('Modal closed2');
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.close();
      console.log('Modal closed3');
    }
  }

  private focusFirstElement(): void {
    const root = this.hostRef.nativeElement as HTMLElement;

    const focusable = root.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as HTMLElement | null;

    focusable?.focus();
  }
}
