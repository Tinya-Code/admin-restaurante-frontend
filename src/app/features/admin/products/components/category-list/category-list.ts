import { Component, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../../../core/models/category.model';
import datos from '../../../../../data/categories.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  categoryList = signal<Category[]>([]);

  ngOnInit(): void {
    this.categoryList.set(datos as Category[]);
  }

  CategorySelect = signal<string>('');

  @Output()
  categoryChange = new EventEmitter<string>()

  add(category:string) :void {
    this.CategorySelect.set(category);
    this.categoryChange.emit(category)
    console.log(category);
  }
}