import { Component, OnInit, signal, output, inject } from '@angular/core';
import { Category } from '../../../../../core/models/category.model';
import { CommonModule } from '@angular/common';
import  { SearchService } from '../../services/search';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  categoryList = signal<Category[]>([]);

  private searchService = inject(SearchService);

  async ngOnInit(): Promise<void> {
    try {
      const response = await firstValueFrom(
        this.searchService.searchCategories()
      );
      
      this.categoryList.set(response.data || []);
      console.log('✅ Categorías cargadas:', response.data);
      
    } catch (error) {
      console.error('❌ Error cargando categorías:', error);
      this.categoryList.set([]);
    }
  }

  CategorySelect = signal<string>('');

  // Output para emitir la categoria buscada (Signal Output)
  categoryChange = output<string>()

  addCategory(category: string): void {
    this.CategorySelect.set(category);
    this.categoryChange.emit(category);
    console.log('Categoría seleccionada:', category);
  }
}