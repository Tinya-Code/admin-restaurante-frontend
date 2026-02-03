import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTable, TableColumn, PaginationMeta, TableAction } from './data-table';
import { Edit } from 'lucide-angular';

describe('DataTable', () => {
  let component: DataTable;
  let fixture: ComponentFixture<DataTable>;

  const mockMeta: PaginationMeta = {
    limit: 10,
    current_page: 1,
    total_pages: 5,
    total_items: 50,
    has_next: true,
    has_prev: false,
  };

  const mockColumns: TableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Nombre' },
    { key: 'price', label: 'Precio', render: (v) => `$${v.toFixed(2)}` },
  ];

  const mockData = [
    {
      id: '1',
      name: 'Producto 1',
      price: 99.99,
      image_url: 'https://example.com/1.jpg',
      is_available: true,
    },
    { id: '2', name: 'Producto 2', price: 199.99, is_available: false },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTable],
    }).compileComponents();

    fixture = TestBed.createComponent(DataTable);
    component = fixture.componentInstance;
  });

  // ==================== CREACIÓN ====================
  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  // ==================== INPUTS ====================
  it('should accept inputs and defaults', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('meta', mockMeta);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.detectChanges();

    expect(component.dataSource()).toEqual(mockData);
    expect(component.imageKey()).toBe('image_url');
    expect(component.statusKey()).toBe('is_available');
  });

  // ==================== PAGINACIÓN ====================
  it('should emit pageChange on goToPage', () => {
    spyOn(component.pageChange, 'emit');
    component.goToPage(3);
    expect(component.pageChange.emit).toHaveBeenCalledWith(3);
  });

  it('should emit nextPage when has_next', () => {
    spyOn(component.pageChange, 'emit');
    component.nextPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  // ==================== HELPERS ====================
  it('should get cell value with render', () => {
    const value = component.getCellValue(mockData[0], mockColumns[2]);
    expect(value).toBe('$99.99');
  });

  it('should return placeholder when image missing', () => {
    const url = component.getImageUrl(mockData[1]);
    expect(url).toBe('https://via.placeholder.com/80');
  });

  // ==================== EVENTOS ====================
  it('should emit rowClick', () => {
    spyOn(component.rowClick, 'emit');
    component.onRowClick(mockData[0]);
    expect(component.rowClick.emit).toHaveBeenCalledWith(mockData[0]);
  });

  it('should execute action handler', () => {
    const handlerSpy = jasmine.createSpy('handler');
    const action: TableAction = { label: 'Test', icon: Edit, handler: handlerSpy };
    component.onActionClick(action, mockData[0], { stopPropagation: () => {} } as any);
    expect(handlerSpy).toHaveBeenCalledWith(mockData[0]);
  });

  // ==================== RENDER ====================
  it('should show empty state when no data', () => {
    fixture.componentRef.setInput('dataSource', []);
    fixture.componentRef.setInput('meta', { ...mockMeta, total_items: 0 });
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('emptyMessage', 'Sin productos');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.textContent).toContain('Sin productos');
  });
});
