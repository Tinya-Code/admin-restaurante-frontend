import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTable, TableColumn } from './data-table';
import { signal } from '@angular/core';

describe('DataTable', () => {
  let component: DataTable;
  let fixture: ComponentFixture<DataTable>;

  const mockColumns: TableColumn[] = [
    { key: 'id', label: 'ID', width: '80px' },
    { key: 'name', label: 'Nombre', sortable: true },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Estado', align: 'center' },
  ];

  const mockData = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', status: 'active' },
    { id: 2, name: 'María García', email: 'maria@example.com', status: 'inactive' },
    { id: 3, name: 'Pedro López', email: 'pedro@example.com', status: 'active' },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DataTable]
    }).compileComponents();

    fixture = TestBed.createComponent(DataTable);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display correct number of rows based on pageSize', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.detectChanges();

    component.pageSize.set(2);
    fixture.detectChanges();

    expect(component.paginatedData().length).toBe(2);
  });

  it('should calculate total pages correctly', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    component.pageSize.set(2);
    fixture.detectChanges();

    expect(component.totalPages()).toBe(2); // 3 items / 2 per page = 2 pages
  });

  it('should navigate to next page', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    component.pageSize.set(2);
    fixture.detectChanges();

    component.nextPage();
    expect(component.currentPage()).toBe(2);
  });

  it('should navigate to previous page', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    component.currentPage.set(2);
    fixture.detectChanges();

    component.previousPage();
    expect(component.currentPage()).toBe(1);
  });

  it('should not go below page 1', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    component.currentPage.set(1);
    fixture.detectChanges();

    component.previousPage();
    expect(component.currentPage()).toBe(1);
  });

  it('should not exceed total pages', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    component.pageSize.set(2);
    component.currentPage.set(2);
    fixture.detectChanges();

    component.nextPage();
    expect(component.currentPage()).toBe(2); // No debe pasar de la última página
  });

  it('should go to first page', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    component.currentPage.set(2);
    fixture.detectChanges();

    component.firstPage();
    expect(component.currentPage()).toBe(1);
  });

  it('should go to last page', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    component.pageSize.set(1);
    component.currentPage.set(1);
    fixture.detectChanges();

    component.lastPage();
    expect(component.currentPage()).toBe(3);
  });

  it('should change page size and reset to page 1', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    component.currentPage.set(2);
    fixture.detectChanges();

    const event = {
      target: { value: '10' }
    } as any;

    component.changePageSize(event);
    
    expect(component.pageSize()).toBe(10);
    expect(component.currentPage()).toBe(1);
  });

  it('should emit rowClick when row is clicked', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.detectChanges();

    spyOn(component.rowClick, 'emit');
    
    const testRow = mockData[0];
    component.onRowClick(testRow);

    expect(component.rowClick.emit).toHaveBeenCalledWith(testRow);
  });

  it('should render empty state when no data', () => {
    fixture.componentRef.setInput('dataSource', []);
    fixture.componentRef.setInput('columns', mockColumns);
    fixture.componentRef.setInput('emptyMessage', 'No hay datos');
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    const emptyMessage = compiled.querySelector('.empty-message');

    expect(emptyMessage).toBeTruthy();
    expect(emptyMessage.textContent).toContain('No hay datos');
  });

  it('should use custom render function if provided', () => {
    const columnsWithRender: TableColumn[] = [
      {
        key: 'status',
        label: 'Estado',
        render: (value) => value === 'active' ? 'Activo' : 'Inactivo'
      }
    ];

    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', columnsWithRender);
    fixture.detectChanges();

    const result = component.getCellValue(mockData[0], columnsWithRender[0]);
    expect(result).toBe('Activo');
  });

  it('should calculate start and end index correctly', () => {
    fixture.componentRef.setInput('dataSource', mockData);
    fixture.componentRef.setInput('columns', mockColumns);
    component.pageSize.set(2);
    component.currentPage.set(1);
    fixture.detectChanges();

    expect(component.startIndex()).toBe(1);
    expect(component.endIndex()).toBe(2);

    component.currentPage.set(2);
    fixture.detectChanges();

    expect(component.startIndex()).toBe(3);
    expect(component.endIndex()).toBe(3);
  });
});