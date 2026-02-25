import { Component, inject, OnInit } from '@angular/core';
import { ProductForm } from '../../components/product-form/product-form';
import { Product, ProductCreate, ProductPatch, ProductUpdate } from '../../../../../core/models/product.model';
import { ProductService } from '../../services/product';
import { Notification } from '../../../../../core/services/notification';
import { ActivatedRoute } from '@angular/router';
import { BackButton } from "../../../../../shared/components/back-button/back-button";
@Component({
  selector: 'app-product-form-page',
  imports: [ProductForm, BackButton],
  templateUrl: './product-form-page.html',
  styleUrl: './product-form-page.css',
})
export class ProductFormPage implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly notification = inject(Notification);
  private readonly route = inject(ActivatedRoute);
productData: Product | undefined = undefined;

ngOnInit(): void {
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
