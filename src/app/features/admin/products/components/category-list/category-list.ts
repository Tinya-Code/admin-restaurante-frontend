import { Component, OnInit, signal, Output, EventEmitter } from '@angular/core';
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

  constructor(private searchService: SearchService) {}

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
  // evento para emitir la categoria seleccionada
  @Output()
  categoryChange = new EventEmitter<string>()

  add(category: string): void {
    this.CategorySelect.set(category);
    this.categoryChange.emit(category);
    console.log('Categoría seleccionada:', category);
  }
}