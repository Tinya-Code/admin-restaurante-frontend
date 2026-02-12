import { Component, OnInit, signal, input, output, inject, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Product, ProductCreate, ProductUpdate } from '../../../../../core/models/product.model';
//import { Category } from '../../services/category.service';

@Component({
  selector: 'app-product-form',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.css',
})
export class ProductForm implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Inputs
  readonly product = input<Product | null>(null);
  categories = signal<any[]>([
    { id: '239f1742-fc12-4f17-bf2a-bd955890582b', name: 'Bebidas' },
    { id: '2', name: 'Platos principales' },
    { id: '3', name: 'Postres' },
    { id: '4', name: 'Entradas' },
  ]);

  //readonly categories = input.required<Category[]>();
  readonly loading = input<boolean>(false);

  // Outputs
  readonly formSubmit = output<{ data: ProductCreate | ProductUpdate; image?: File }>();
  readonly formCancel = output<void>();

  // Signals
  readonly imagePreview = signal<string | null>(null);
  readonly selectedFile = signal<File | null>(null);
  readonly isEditMode = signal(false);

  // Form
  productForm!: FormGroup;

  constructor() {
    // Effect para cargar datos cuando cambia el producto
    effect(() => {
      const product = this.product();
      if (product) {
        this.isEditMode.set(true);
        this.loadProductData(product);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.productForm = this.fb.group({
      category_id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      price: [0, [Validators.required, Validators.min(0.01)]],
      is_available: [true],
      display_order: [0],
    });
  }

  private loadProductData(product: Product): void {
    this.productForm.patchValue({
      category_id: product.category_id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      is_available: product.is_available,
    });

    if (product.image_url) {
      this.imagePreview.set(product.image_url);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) return;

    const file = input.files[0];

    if (!this.validateImage(file)) {
      this.resetFileInput(input);
      return;
    }

    this.selectedFile.set(file);
    this.generateImagePreview(file);
  }

  private validateImage(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      alert('Por favor selecciona una imagen válida (JPG, PNG, GIF, WEBP)');
      return false;
    }

    if (file.size > maxSize) {
      alert('La imagen no debe superar los 5MB');
      return false;
    }

    return true;
  }

  private generateImagePreview(file: File): void {
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview.set(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }

  private resetFileInput(input: HTMLInputElement): void {
    input.value = '';
  }

  removeImage(): void {
    this.selectedFile.set(null);
    this.imagePreview.set(null);

    const fileInput = document.getElementById('image_file') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const formValue = this.productForm.value;
    const data = this.buildSubmitData(formValue);

    this.formSubmit.emit({
      data,
      image: this.selectedFile() || undefined,
    });
  }

  private buildSubmitData(formValue: any): ProductCreate | ProductUpdate {
    const baseData = {
      category_id: formValue.category_id,
      name: formValue.name,
      description: formValue.description || undefined,
      price: Number(formValue.price),
      is_available: formValue.is_available,
      display_order: formValue.display_order ?? 0,
    };

    if (this.isEditMode()) {
      return {
        id: this.product()!.id,
        ...baseData,
        image_url: this.product()!.image_url,
      } as ProductUpdate;
    }

    return {
      ...baseData,
      image_url: undefined,
    } as ProductCreate;
  }

  onCancel(): void {
    this.formCancel.emit();
  }

  get categoryId() {
    return this.productForm.get('category_id');
  }

  get name() {
    return this.productForm.get('name');
  }
  get description() {
    return this.productForm.get('description');
  }
  get price() {
    return this.productForm.get('price');
  }
  get isAvailable() {
    return this.productForm.get('is_available');
  }
}
