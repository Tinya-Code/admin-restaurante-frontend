import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Location } from '@angular/common';
import { BackButton } from './back-button';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('BackButton', () => {
  let component: BackButton;
  let fixture: ComponentFixture<BackButton>;
  let location: Location;
  let buttonElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackButton],
    }).compileComponents();

    fixture = TestBed.createComponent(BackButton);
    component = fixture.componentInstance;
    location = TestBed.inject(Location);
    fixture.detectChanges();
    buttonElement = fixture.debugElement.query(By.css('button'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Rendering', () => {
    it('should render button element', () => {
      expect(buttonElement).toBeTruthy();
      expect(buttonElement.nativeElement.tagName).toBe('BUTTON');
    });

    it('should render with default text "Volver"', () => {
      const textElement = fixture.debugElement.query(By.css('.back-button__text'));
      expect(textElement.nativeElement.textContent.trim()).toBe('Volver');
    });

    it('should render with custom text when provided', () => {
      component.text.set('Regresar');
      fixture.detectChanges();

      const textElement = fixture.debugElement.query(By.css('.back-button__text'));
      expect(textElement.nativeElement.textContent.trim()).toBe('Regresar');
    });

    it('should render icon by default', () => {
      const iconElement = fixture.debugElement.query(By.css('.back-button__icon'));
      expect(iconElement).toBeTruthy();
    });

    it('should not render icon when showIcon is false', () => {
      component.showIcon.set(false);
      fixture.detectChanges();

      const iconElement = fixture.debugElement.query(By.css('.back-button__icon'));
      expect(iconElement).toBeNull();
    });

    it('should apply custom class when provided', () => {
      component.customClass.set('btn-primary');
      fixture.detectChanges();

      expect(buttonElement.nativeElement.classList.contains('btn-primary')).toBe(true);
    });

    it('should always have base back-button class', () => {
      expect(buttonElement.nativeElement.classList.contains('back-button')).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have button type="button"', () => {
      expect(buttonElement.nativeElement.getAttribute('type')).toBe('button');
    });

    it('should have default aria-label', () => {
      expect(buttonElement.nativeElement.getAttribute('aria-label'))
        .toBe('Volver a la página anterior');
    });

    it('should apply custom aria-label when provided', () => {
      component.ariaLabel.set('Volver al inicio');
      fixture.detectChanges();

      expect(buttonElement.nativeElement.getAttribute('aria-label'))
        .toBe('Volver al inicio');
    });

    it('should have title attribute matching aria-label', () => {
      const ariaLabel = buttonElement.nativeElement.getAttribute('aria-label');
      const title = buttonElement.nativeElement.getAttribute('title');
      expect(title).toBe(ariaLabel);
    });

    it('should have aria-hidden="true" on icon element', () => {
      const iconElement = fixture.debugElement.query(By.css('.back-button__icon'));
      expect(iconElement.nativeElement.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Navigation functionality', () => {
    it('should call location.back() when clicked', () => {
      spyOn(location, 'back');

      buttonElement.nativeElement.click();

      expect(location.back).toHaveBeenCalledTimes(1);
    });

    it('should call goBack method when button is clicked', () => {
      spyOn(component, 'goBack');

      buttonElement.nativeElement.click();

      expect(component.goBack).toHaveBeenCalledTimes(1);
    });
  });

  describe('Signal-based inputs', () => {
    it('should update text signal correctly', () => {
      component.text.set('Atrás');
      expect(component.text()).toBe('Atrás');
    });

    it('should update showIcon signal correctly', () => {
      component.showIcon.set(false);
      expect(component.showIcon()).toBeFalse();
    });

    it('should update customClass signal correctly', () => {
      component.customClass.set('my-class');
      expect(component.customClass()).toBe('my-class');
    });

    it('should update ariaLabel signal correctly', () => {
      component.ariaLabel.set('Etiqueta accesible');
      expect(component.ariaLabel()).toBe('Etiqueta accesible');
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text signal', () => {
      component.text.set('');
      fixture.detectChanges();

      const textElement = fixture.debugElement.query(By.css('.back-button__text'));
      expect(textElement.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle long text', () => {
      const longText = 'Este es un texto muy largo para el botón de retroceso';
      component.text.set(longText);
      fixture.detectChanges();

      const textElement = fixture.debugElement.query(By.css('.back-button__text'));
      expect(textElement.nativeElement.textContent.trim()).toBe(longText);
    });
  });

  describe('Location service integration', () => {
    it('should inject Location service', () => {
      expect(location).toBeTruthy();
      expect(location instanceof Location).toBeTrue();
    });

    it('should use Location.back() method', () => {
      const spy = spyOn(location, 'back');
      component.goBack();
      expect(spy).toHaveBeenCalled();
    });
  });
});
