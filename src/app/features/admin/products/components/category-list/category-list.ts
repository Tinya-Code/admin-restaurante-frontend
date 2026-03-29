import { Component, input, signal, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../../../core/models/category.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  readonly categories = input<Category[]>([]);
  CategorySelect = signal<string>('all');

  @Output()
  categoryChange = new EventEmitter<string>()

  add(category:string) :void {
    this.CategorySelect.set(category);
    this.categoryChange.emit(category)
    console.log(category);
  }
}