import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductForm } from '../../components/product-form/product-form';
import { Product, ProductCreate, ProductPatch, ProductUpdate } from '../../../../../core/models/product.model';
import { ProductService } from '../../services/product';
import { CategoryService } from '../../../categories/services/category';
import { Notification } from '../../../../../core/services/notification';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../../../core/models/category.model';
import { BackButton } from "../../../../../shared/components/back-button/back-button";
import { Router } from '@angular/router';
@Component({
  selector: 'app-product-form-page',
  imports: [ProductForm, BackButton],
  templateUrl: './product-form-page.html',
  styleUrl: './product-form-page.css',
})
export class ProductFormPage implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly categoryService = inject(CategoryService);
  private readonly notification = inject(Notification);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  productData: Product | undefined = undefined;
  categoriesData = signal<Category[]>([]);
  isSubmitting = signal(false);

ngOnInit(): void {
  this.categoryService.getCategories({ limit: 100, is_active: true }).subscribe({
    next: (res) => {
      this.categoriesData.set(res.data || []);
    },
    error: (err) => {
      this.notification.error('Error al cargar categorías');
      console.error(err);
    }
  });

  const id = this.route.snapshot.paramMap.get('id');
  if (id) {
    this.productService.getProductById(id).subscribe({
      next: (res) => {
        this.productData = res.data; // ✅
      },
      error: (err) => {
        this.notification.error('Error al cargar producto');
        console.error(err);
      },
    });
  }
}


  onFormSubmit(data: ProductCreate | ProductUpdate): void {
    if (this.isSubmitting()) return;
    this.isSubmitting.set(true);

    if ('id' in data) {
      this.productService
        .updateProduct(data.id, data as ProductUpdate)
        .subscribe({
          next: (res) => {
            this.notification.success('Producto actualizado correctamente');
            this.isSubmitting.set(false);
            this.router.navigate(['/admin/products']);
          },
          error: (err) => {
            this.notification.error('Error al actualizar producto');
            this.isSubmitting.set(false);
            console.error(err);
          },
        });
    } else {
      this.productService.createProduct(data as ProductCreate).subscribe({
        next: (res) => {
          this.notification.success('Producto creado correctamente');
          this.isSubmitting.set(false);
          this.router.navigate(['/admin/products']);
        },
        error: (err) => {
          this.notification.error('Error al crear producto');
          this.isSubmitting.set(false);
          console.error(err);
        },
      });
    }
  }

  onFormCancel(): void {
    this.router.navigate(['/admin/products']);
  }
}
