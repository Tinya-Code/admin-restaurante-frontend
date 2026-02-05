import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBar } from './search-bar';

describe('SearchBar', () => {
  let component: SearchBar;
  let fixture: ComponentFixture<SearchBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it(`velida que la palabra buscada tenga al menos 4 caracteres`, ()=>{
    component.word.setValue({searchWord: `abc`});

    const result = component.onsearch();
    expect(result).toBe('');

  });
  it(`debe retornar la palabra buscada si tiene 4 o mas caracteres`, ()=>{
    component.word.setValue({searchWord: `angular`});

    const result = component.onsearch();
    expect(result).toBe(`angular`)
    }
  );
});
