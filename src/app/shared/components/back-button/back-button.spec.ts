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
      imports: [BackButton]
    })
    .compileComponents();

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
      component.text = 'Regresar';
      fixture.detectChanges();
      
      const textElement = fixture.debugElement.query(By.css('.back-button__text'));
      expect(textElement.nativeElement.textContent.trim()).toBe('Regresar');
    });

    it('should render icon by default', () => {
      const iconElement = fixture.debugElement.query(By.css('.back-button__icon'));
      expect(iconElement).toBeTruthy();
      expect(iconElement.nativeElement.tagName).toBe('svg');
    });

    it('should not render icon when showIcon is false', () => {
      component.showIcon = false;
      fixture.detectChanges();
      
      const iconElement = fixture.debugElement.query(By.css('.back-button__icon'));
      expect(iconElement).toBeNull();
    });

    it('should apply custom class when provided', () => {
      component.customClass = 'btn-primary';
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
      component.ariaLabel = 'Volver al inicio';
      fixture.detectChanges();
      
      expect(buttonElement.nativeElement.getAttribute('aria-label'))
        .toBe('Volver al inicio');
    });

    it('should have title attribute matching aria-label', () => {
      const ariaLabel = buttonElement.nativeElement.getAttribute('aria-label');
      const title = buttonElement.nativeElement.getAttribute('title');
      expect(title).toBe(ariaLabel);
    });

    it('should have aria-hidden="true" on icon SVG', () => {
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

    it('should navigate back on keyboard Enter', () => {
      spyOn(location, 'back');
      
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      buttonElement.nativeElement.dispatchEvent(event);
      buttonElement.nativeElement.click(); // Simulates default button behavior
      
      expect(location.back).toHaveBeenCalled();
    });

    it('should navigate back on keyboard Space', () => {
      spyOn(location, 'back');
      
      const event = new KeyboardEvent('keydown', { key: ' ' });
      buttonElement.nativeElement.dispatchEvent(event);
      buttonElement.nativeElement.click(); // Simulates default button behavior
      
      expect(location.back).toHaveBeenCalled();
    });
  });

  describe('Component inputs', () => {
    it('should accept and render text input', () => {
      component.text = 'Atrás';
      fixture.detectChanges();
      
      const textElement = fixture.debugElement.query(By.css('.back-button__text'));
      expect(textElement.nativeElement.textContent.trim()).toBe('Atrás');
    });

    it('should accept showIcon input', () => {
      component.showIcon = false;
      expect(component.showIcon).toBe(false);
    });

    it('should accept customClass input', () => {
      component.customClass = 'my-custom-class';
      expect(component.customClass).toBe('my-custom-class');
    });

    it('should accept ariaLabel input', () => {
      component.ariaLabel = 'Custom accessibility label';
      expect(component.ariaLabel).toBe('Custom accessibility label');
    });
  });

  describe('Styling and CSS classes', () => {
    it('should have back-button__content wrapper', () => {
      const contentElement = fixture.debugElement.query(By.css('.back-button__content'));
      expect(contentElement).toBeTruthy();
    });

    it('should have back-button__text span', () => {
      const textElement = fixture.debugElement.query(By.css('.back-button__text'));
      expect(textElement).toBeTruthy();
    });

    it('should apply multiple custom classes', () => {
      component.customClass = 'btn-primary btn-large';
      fixture.detectChanges();
      
      expect(buttonElement.nativeElement.classList.contains('btn-primary')).toBe(true);
      expect(buttonElement.nativeElement.classList.contains('btn-large')).toBe(true);
    });
  });

  describe('Edge cases', () => {
    it('should handle empty text input', () => {
      component.text = '';
      fixture.detectChanges();
      
      const textElement = fixture.debugElement.query(By.css('.back-button__text'));
      expect(textElement.nativeElement.textContent.trim()).toBe('');
    });

    it('should handle very long text', () => {
      const longText = 'Este es un texto muy largo para el botón de retroceso';
      component.text = longText;
      fixture.detectChanges();
      
      const textElement = fixture.debugElement.query(By.css('.back-button__text'));
      expect(textElement.nativeElement.textContent.trim()).toBe(longText);
    });

    it('should handle special characters in text', () => {
      component.text = '← Volver & Regresar';
      fixture.detectChanges();
      
      const textElement = fixture.debugElement.query(By.css('.back-button__text'));
      expect(textElement.nativeElement.textContent.trim()).toContain('←');
      expect(textElement.nativeElement.textContent.trim()).toContain('&');
    });
  });

  describe('Location service integration', () => {
    it('should inject Location service', () => {
      expect(location).toBeTruthy();
      expect(location instanceof Location).toBe(true);
    });

    it('should use Location.back() method', () => {
      const spy = spyOn(location, 'back');
      component.goBack();
      expect(spy).toHaveBeenCalled();
    });
  });
});
