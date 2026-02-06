import { Component, inject, signal } from '@angular/core';
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
    searchWord: [ `` , [Validators.minLength(4)]]
  })

  // adjudicamos al metodo onsearch la logica de busqueda con retorno de la palabra buscada para conprovar su funcionamiento
  onsearch(): string {
    if (this.word.invalid) {
      console.log('El termino de busqueda debe tener al menos 4 caracteres');
      return '';
    }
    const { searchWord } = this.word.value;
    console.log(searchWord);

    return searchWord as string;
  }
}
