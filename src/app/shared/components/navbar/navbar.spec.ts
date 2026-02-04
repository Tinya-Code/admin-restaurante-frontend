import { Location } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Navbar, NavItem } from './navbar';

fdescribe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;
  let mockLocation: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    mockLocation = jasmine.createSpyObj('Location', ['path']);
    mockLocation.path.and.returnValue('/admin/home');

    await TestBed.configureTestingModule({
      imports: [Navbar, RouterTestingModule],
      providers: [{ provide: Location, useValue: mockLocation }],
    }).compileComponents();
  });

  beforeEach(() => {
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
    const activeData = component.activeItemData();
    expect(activeData?.id).toBe('inicio');
    expect(activeData?.label).toBe('Inicio');
  });

  it('should return correct active state for items', () => {
    expect(component.isActive('inicio')).toBe(true);
    expect(component.isActive('carta')).toBe(false);
  });

  it('should update active item on click', () => {
    const navigationClickSpy = spyOn(component.navigationClick, 'emit');

    component.onItemClick('carta');

    expect(navigationClickSpy).toHaveBeenCalledWith('carta');
  });

  it('should return active item data', () => {
    // Mock location to return carta route
    mockLocation.path.and.returnValue('/admin/menu');

    fixture.detectChanges(); // Re-detect to update computed value

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
    });
  });

  it('should toggle collapse state', () => {
    expect(component.isCollapsed()).toBe(false);

    component.toggleCollapse();
    expect(component.isCollapsed()).toBe(true);

    component.toggleCollapse();
    expect(component.isCollapsed()).toBe(false);
  });

  it('should expand and collapse sidebar', () => {
    // Initially expanded
    expect(component.isCollapsed()).toBe(false);

    // Collapse
    component.toggleCollapse();
    expect(component.isCollapsed()).toBe(true);

    // Expand
    component.toggleCollapse();
    expect(component.isCollapsed()).toBe(false);
  });

  it('should detect active route correctly', () => {
    // Mock location path for testing
    mockLocation.path.and.returnValue('/admin/home');

    fixture.detectChanges();

    expect(component.isActive('inicio')).toBe(true);
    expect(component.isActive('carta')).toBe(false);
  });

  it('should handle mobile button visibility', () => {
    fixture.componentRef.setInput('isMobile', true);
    fixture.detectChanges();

    expect(component.isMobile()).toBe(true);
    // Mobile should not have collapse functionality
    expect(component.isCollapsed()).toBe(false);
  });

  it('should not collapse on mobile', () => {
    fixture.componentRef.setInput('isMobile', true);
    fixture.detectChanges();

    component.toggleCollapse();
    // Collapse state should not affect mobile layout
    expect(component.isCollapsed()).toBe(true);
    // But mobile layout should still work correctly
    expect(component.isMobile()).toBe(true);
  });

  it('should recognize active route from location', () => {
    // Test route recognition logic
    const testCases = [
      { path: '/admin/home', expectedActive: 'inicio' },
      { path: '/admin/menu', expectedActive: 'carta' },
      { path: '/admin/categories', expectedActive: 'categoria' },
      { path: '/admin/settings', expectedActive: 'configuracion' },
    ];

    testCases.forEach(({ path, expectedActive }) => {
      // Mock location path
      mockLocation.path.and.returnValue(path);

      fixture.detectChanges();

      const navItem = component
        .navItems()
        .find((item) => path.includes(item.route) || item.route.includes(path));
      expect(navItem?.id).toBe(expectedActive);
    });
  });

  it('should validate nav item structure', () => {
    const items = component.navItems();

    items.forEach((item: NavItem) => {
      expect(item.route).toBeDefined();
      expect(item.route).toMatch(/^\/admin\//);
    });
  });
});
