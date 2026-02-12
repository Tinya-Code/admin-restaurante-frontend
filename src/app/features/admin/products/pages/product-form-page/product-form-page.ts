import { Component, inject } from '@angular/core';
import { ProductForm } from '../../components/product-form/product-form';
import { ProductCreate, ProductUpdate } from '../../../../../core/models/product.model';
import { ProductService } from '../../services/product';
import { Notification } from '../../../../../core/services/notification';
@Component({
  selector: 'app-product-form-page',
  imports: [ProductForm],
  templateUrl: './product-form-page.html',
  styleUrl: './product-form-page.css',
})
export class ProductFormPage {
  private readonly productService = inject(ProductService);
  private readonly notification = inject(Notification);
  onFormSubmit(event: { data: ProductCreate | ProductUpdate; image?: File }): void {
    if ('id' in event.data) {
      this.productService
        .updateProduct(event.data.id, event.data as ProductUpdate, event.image)
        .subscribe({
          next: (res) => {
            this.notification.success('Producto actualizado correctamente');
            console.log('Producto actualizado', res);
          },
          error: (err) => {
            this.notification.error('Error al actualizar producto');
            console.error(err);
          },
        });
    } else {
      this.productService.createProduct(event.data as ProductCreate, event.image).subscribe({
        next: (res) => {
          this.notification.success('Producto creado correctamente');
          console.log('Producto creado', res);
        },
        error: (err) => {
          this.notification.error('Error al crear producto');
          console.error(err);
        },
      });
    }
  }
  onFormCancel(): void {
    this.notification.info('Formulario cancelado');
  }
}
