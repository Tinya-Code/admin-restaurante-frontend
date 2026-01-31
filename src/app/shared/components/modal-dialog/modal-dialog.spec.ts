import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalDialog } from './modal-dialog';

@Component({
  selector: 'app-test-host',
  template: `
    <app-modal-dialog
      [open]="isOpen"
      [title]="title"
      [closeOnBackdrop]="closeOnBackdrop"
      (closed)="onClosed()"
    >
      <p>Dynamic content test</p>
    </app-modal-dialog>
  `,
  imports: [ModalDialog],
  standalone: true,
})
class TestHostComponent {
  @Input() isOpen = false;
  @Input() title = 'Test Modal';
  @Input() closeOnBackdrop = true;
  closedCalled = false;

  onClosed(): void {
    this.closedCalled = true;
  }
}

describe('ModalDialog', () => {
  let component: ModalDialog;
  let fixture: ComponentFixture<ModalDialog>;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDialog, TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();

    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close programmatically', () => {
    testHostFixture.componentInstance.isOpen = true;
    testHostFixture.detectChanges();

    const modalElement = testHostFixture.nativeElement.querySelector('.modal');
    const backdropElement = testHostFixture.nativeElement.querySelector('.backdrop');

    expect(modalElement).toBeTruthy();
    expect(backdropElement).toBeTruthy();
    expect(modalElement).toHaveClass('modal');

    testHostFixture.componentInstance.isOpen = false;
    testHostFixture.detectChanges();

    const modalElementAfterClose = testHostFixture.nativeElement.querySelector('.modal');
    const backdropElementAfterClose = testHostFixture.nativeElement.querySelector('.backdrop');

    expect(modalElementAfterClose).toBeFalsy();
    expect(backdropElementAfterClose).toBeFalsy();
  });

  it('should display dynamic title and content', () => {
    testHostFixture.componentInstance.isOpen = true;
    testHostFixture.componentInstance.title = 'Custom Title';
    testHostFixture.detectChanges();

    const titleElement = testHostFixture.nativeElement.querySelector('.modal-title');
    const contentElement = testHostFixture.nativeElement.querySelector('.modal__content');

    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Custom Title');
    expect(contentElement).toBeTruthy();
    expect(contentElement.textContent).toContain('Dynamic content test');
  });

  it('should emit closed event when close button is clicked', () => {
    testHostFixture.componentInstance.isOpen = true;
    testHostFixture.detectChanges();

    const closeButton = testHostFixture.nativeElement.querySelector('.close-btn');
    expect(closeButton).toBeTruthy();

    closeButton.click();
    testHostFixture.detectChanges();

    expect(testHostFixture.componentInstance.closedCalled).toBe(true);
  });

  it('should close on backdrop click when closeOnBackdrop is true', () => {
    testHostFixture.componentInstance.isOpen = true;
    testHostFixture.componentInstance.closeOnBackdrop = true;
    testHostFixture.detectChanges();

    const backdrop = testHostFixture.nativeElement.querySelector('.backdrop');
    expect(backdrop).toBeTruthy();

    backdrop.click();
    testHostFixture.detectChanges();

    expect(testHostFixture.componentInstance.closedCalled).toBe(true);
  });

  it('should not close on backdrop click when closeOnBackdrop is false', () => {
    testHostFixture.componentInstance.isOpen = true;
    testHostFixture.componentInstance.closeOnBackdrop = false;
    testHostFixture.detectChanges();

    const backdrop = testHostFixture.nativeElement.querySelector('.backdrop');
    expect(backdrop).toBeTruthy();

    backdrop.click();
    testHostFixture.detectChanges();

    expect(testHostFixture.componentInstance.closedCalled).toBe(false);
  });
});
