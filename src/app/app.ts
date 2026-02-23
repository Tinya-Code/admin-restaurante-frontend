import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Toast } from './shared/components/toast/toast';
import { CategoryListPage } from './features/admin/categories/pages/category-list-page/category-list-page';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Toast, CategoryListPage],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('sassAdminRestaurante');
}
