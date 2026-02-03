import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Navbar, NavItem } from './navbar';

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Navbar, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 4 navigation items', () => {
    const items = component.navItems();
    expect(items.length).toBe(4);
    expect(items.map((item) => item.id)).toEqual(['inicio', 'carta', 'categoria', 'configuracion']);
  });

  it('should set inicio as active by default', () => {
    expect(component.activeItem()).toBe('inicio');
  });

  it('should return correct active state for items', () => {
    expect(component.isActive('inicio')).toBe(true);
    expect(component.isActive('carta')).toBe(false);
  });

  it('should update active item on click', () => {
    const navigationClickSpy = spyOn(component.navigationClick, 'emit');

    component.onItemClick('carta');

    expect(component.activeItem()).toBe('carta');
    expect(navigationClickSpy).toHaveBeenCalledWith('carta');
  });

  it('should return active item data', () => {
    component.activeItem.set('carta');
    const activeData = component.activeItemData();

    expect(activeData?.id).toBe('carta');
    expect(activeData?.label).toBe('Carta');
  });

  it('should handle mobile input', () => {
    fixture.componentRef.setInput('isMobile', true);
    fixture.detectChanges();

    expect(component.isMobile()).toBe(true);
  });

  it('should have correct navigation structure', () => {
    const items = component.navItems();

    items.forEach((item: NavItem) => {
      expect(item.id).toBeDefined();
      expect(item.label).toBeDefined();
      expect(item.icon).toBeDefined();
      expect(item.route).toBeDefined();
      expect(item.route).toMatch(/^\/admin\//);
    });
  });
});
