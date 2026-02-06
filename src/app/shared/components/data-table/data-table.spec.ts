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
    { key: 'price', label: 'Precio' },
  ];

  const mockData = [
    { id: '1', name: 'Producto 1', price: 99.99, image_url: 'https://example.com/1.jpg', is_available: true },
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
  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  // ==================== INPUTS ====================
  it('debería aceptar inputs y valores por defecto', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('meta', mockMeta);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('imageKey', 'image_url'); // importante para evitar fallo
    fixture.detectChanges();

    expect(component.dataSource()).toEqual(mockData);
    expect(component.imageKey()).toBe('image_url');
    expect(component.statusKey()).toBe('is_available');
  });

  // ==================== PAGINACIÓN ====================
  it('debería emitir pageChange al ir a una página', () => {
    fixture.componentRef.setInput('meta', mockMeta);
    spyOn(component.pageChange, 'emit');
    component.goToPage(3);
    expect(component.pageChange.emit).toHaveBeenCalledWith(3);
  });

  it('debería emitir nextPage cuando hay siguiente', () => {
    fixture.componentRef.setInput('meta', mockMeta);
    spyOn(component.pageChange, 'emit');
    component.nextPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('debería emitir previousPage cuando hay anterior', () => {
    fixture.componentRef.setInput('meta', { ...mockMeta, has_prev: true, current_page: 2 });
    spyOn(component.pageChange, 'emit');
    component.previousPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(1);
  });

  // ==================== EVENTOS ====================
  it('debería emitir rowClick', () => {
    spyOn(component.rowClick, 'emit');
    component.onRowClick(mockData[0]);
    expect(component.rowClick.emit).toHaveBeenCalledWith(mockData[0]);
  });

  it('debería ejecutar el handler de acción y cerrar el menú', () => {
    const handlerSpy = jasmine.createSpy('handler');
    const action: TableAction = { label: 'Editar', icon: Edit, handler: handlerSpy };
    spyOn(component, 'closeMenu');
    component.onActionClick(action, mockData[0], { stopPropagation: () => {} } as any);
    expect(handlerSpy).toHaveBeenCalledWith(mockData[0]);
    expect(component.closeMenu).toHaveBeenCalled();
  });
});