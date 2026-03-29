import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryForm } from '../../components/category-form/category-form';
import { Category, CategoryCreate, CategoryUpdate } from '../../../../../core/models/category.model';
import { CategoryService } from '../../services/category.service';
import { NotificationService } from '../../../../../core/services/notification.service';
import { BackButton } from '../../../../../shared/components/back-button/back-button';

@Component({
  selector: 'app-category-form-page',
  imports: [CategoryForm, BackButton],
  templateUrl: './category-form-page.html',
  styleUrl: './category-form-page.css',
})
export class CategoryFormPage implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly notification = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  categoryData: Category | undefined = undefined;
  loading = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loading = true;
      this.categoryService.getCategoryById(id).subscribe({
        next: (res) => {
          this.categoryData = res.data;
          this.loading = false;
        },
        error: (err) => {
          this.notification.error('Error al cargar la categoría');
          console.error(err);
          this.loading = false;
        },
      });
    }
  }

  onFormSubmit(event: { data: CategoryCreate | CategoryUpdate }): void {
    this.loading = true;
    const dataId = (event.data as any).id;
    if (dataId) {
      this.categoryService.updateCategory(dataId, event.data as CategoryUpdate).subscribe({
        next: (res) => {
          this.notification.success('Categoría actualizada correctamente');
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          this.notification.error('Error al actualizar la categoría');
          console.error(err);
          this.loading = false;
        },
      });
    } else {
      this.categoryService.createCategory(event.data as CategoryCreate).subscribe({
        next: (res) => {
          this.notification.success('Categoría creada correctamente');
          this.router.navigate(['/admin/categories']);
        },
        error: (err) => {
          if (err?.status === 409) {
            this.notification.error('Ya existe una categoría con ese nombre. Elige uno diferente.');
          } else {
            this.notification.error('Error al crear la categoría. Inténtalo de nuevo.');
          }
          console.error(err);
          this.loading = false;
        },
      });
    }
  }

  onFormCancel(): void {
    this.router.navigate(['/admin/categories']);
  }
}
