import { Component, inject, Output, EventEmitter } from '@angular/core';
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
  searchIcon = Search
  
  // iniciamos el form builder
  private fb = inject(FormBuilder);

  // signal para almacenar la palabra buscada
  word = this.fb.group({
    searchWord: [ `` , [Validators.minLength(4), Validators.maxLength(100)]]
  })

  // Metodo para buscar productos
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

  // Output para emitir la palabra buscada
  @Output()
  searchChange = new EventEmitter<string>()

  // Metodo para limpiar el formulario
  clear(): void {
    this.word.reset();
  }

}
