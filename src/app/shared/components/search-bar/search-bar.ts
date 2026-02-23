import { Component, inject, output } from '@angular/core';
import { LucideAngularModule, Search } from 'lucide-angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  // Icon
  searchIcon = Search;

  // iniciamos el form builder
  private fb = inject(FormBuilder);
  searchChange = output<string>();

  // signal para almacenar la palabra buscada
  word = this.fb.group({
    searchWord: [``, [Validators.minLength(4), Validators.maxLength(100)]],
  });

  clear(): void {
    this.word.reset();
    this.searchChange.emit('');
  }
  // adjudicamos al metodo onsearch la logica de busqueda con retorno de la palabra buscada para conprovar su funcionamiento
  onsearch(): void {
    if (this.word.invalid) {
      console.log('El termino de busqueda debe tener al menos 4 caracteres');
      return;
    }
    const { searchWord } = this.word.value;
    console.log(`Palabra buscada:`, searchWord);
    this.searchChange.emit(searchWord as string);
    console.log('Emitiendo palabra buscada al componente padre');
  }
}
