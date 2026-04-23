import { Component, inject, output, OnInit, DestroyRef } from '@angular/core';
import { LucideAngularModule, Search, X } from 'lucide-angular';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-search-bar',
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './search-bar.html'
})
export class SearchBar {
  // Icons
  searchIcon = Search;
  clearIcon = X;

  private fb = inject(FormBuilder);
  
  searchChange = output<string>();

  searchForm = this.fb.group({
    searchWord: [''],
  });

  clear(): void {
    this.searchForm.patchValue({ searchWord: '' });
    this.searchChange.emit('');
  }

  onsearch(): void {
    const value = this.searchForm.get('searchWord')?.value;
    this.searchChange.emit(value || '');
  }
}
