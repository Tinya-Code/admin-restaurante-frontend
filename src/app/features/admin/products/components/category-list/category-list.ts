import { Component, OnInit, signal } from '@angular/core';
import { Category } from '../../../../../core/models/category.model';
import datos from '../../../../../data/categories.json';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList implements OnInit {
  categoryList = signal<Category[]>([]);

  ngOnInit(): void {
    this.categoryList.set(datos as Category[]);
  }
}