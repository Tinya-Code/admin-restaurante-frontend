import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, CircleAlert, LoaderCircle } from 'lucide-angular';
import { CategoryService } from '../../services/category';
import { Notification } from '../../../../../core/services/notification';
import { Storage } from '../../../../../core/services/storage';
import { CategoryCreate } from '../../../../../core/models/category.model';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm implements OnInit {
  // ── Iconos ───────────────────────────────────────────────────────────────
  readonly CircleAlert = CircleAlert;
  readonly LoaderCircle = LoaderCircle;

  // ── Dependencias ─────────────────────────────────────────────────────────
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private notification = inject(Notification);
  private storage = inject(Storage);

  // ── Estado ───────────────────────────────────────────────────────────────
  form!: FormGroup;
  isSubmitting = false;

  /**
   * Obtenidos de localStorage mediante Storage.
   * No se incluyen como controles del formulario ni son visibles en UI.
   */
  private restaurantId!: string;
  private menuId!: string;

  // ── Ciclo de vida ────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.restaurantId = this.storage.get<string>('restaurant_id') ?? '';
    this.menuId = this.storage.get<string>('menu_id') ?? '';

    this.form = this.fb.group({
      // Campos obligatorios
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],

      // Campos opcionales — se omiten del DTO si el usuario no los toca
      is_active: [true],
      display_order: [null],
    });
  }

  // ── Getters para el template ──────────────────────────────────────────────
  get nameCtrl() {
    return this.form.get('name')!;
  }
  get descriptionCtrl() {
    return this.form.get('description')!;
  }

  // ── Acciones ──────────────────────────────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { name, description, is_active, display_order } = this.form.getRawValue();

    /**
     * Se construye el DTO base con los campos siempre presentes.
     * display_order se añade solo si el usuario ingresó un valor;
     * de lo contrario el backend aplica su default (0).
     */
    const dto: CategoryCreate = {
      restaurant_id: this.restaurantId,
      menu_id: this.menuId,
      name: (name as string).trim(),
      description: (description as string).trim(),
      is_active: is_active as boolean,
      ...(display_order !== null && display_order !== ''
        ? { display_order: Number(display_order) }
        : {}),
    };

    this.categoryService.createCategory(dto).subscribe({
      next: () => {
        this.notification.success('Categoría creada correctamente.');
        this.router.navigate(['/admin/categories']);
      },
      error: (err) => {
        this.isSubmitting = false;

        if (err?.status === 409) {
          this.notification.error('Ya existe una categoría con ese nombre. Elige uno diferente.');
        } else {
          this.notification.error('No se pudo crear la categoría. Inténtalo de nuevo.');
        }
      },
    });
  }

  onCancel(): void {
    this.router.navigate(['/admin/categories']);
  }
}
