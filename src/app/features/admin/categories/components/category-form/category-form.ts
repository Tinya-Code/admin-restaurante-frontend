import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CategoryService } from '../../../categories/services/category';
import { Notification } from '../../../../../core/services/notification';
import { Storage } from '../../../../../../app/core/services/storage';
import { CategoryCreate } from '../../../../../../app/core/models/category.model';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.html',
  styleUrl: './category-form.css',
})
export class CategoryForm {
  // ── Dependencias ────────────────────────────────────────────────────────
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private categoryService = inject(CategoryService);
  private notification = inject(Notification);
  private storage = inject(Storage);

  // ── Estado ──────────────────────────────────────────────────────────────
  form!: FormGroup;
  isSubmitting = false;

  /**
   * IDs obtenidos de localStorage vía Storage.
   * No se exponen al template ni son controles del formulario.
   *
   * - restaurant_id → requerido por el backend (CreateCategoryDto).
   * - menu_id       → opcional en el backend, pero se envía siempre
   *                   que esté disponible en storage.
   */
  private restaurantId!: string;
  private menuId!: string | null;

  // ── Ciclo de vida ────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.restaurantId = this.storage.get<string>('restaurant_id') ?? '';
    this.menuId = this.storage.get<string>('menu_id');

    this.form = this.fb.group({
      // ── Obligatorios en UI ──────────────────────────────────────────────
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2), // refleja MinLength(2) del DTO
          Validators.maxLength(255), // refleja MaxLength(255) del DTO
        ],
      ],
      description: [
        '',
        [
          Validators.required, // obligatorio en UI aunque sea opcional en backend
          Validators.maxLength(500),
        ],
      ],

      // ── Opcionales en UI (backend aplica defaults si no se envían) ───────
      is_active: [true], // default true según @ApiPropertyOptional
      display_order: [null], // default 0 según @ApiPropertyOptional; null → no se envía
    });
  }

  // ── Getters para el template ─────────────────────────────────────────────
  get nameCtrl() {
    return this.form.get('name')!;
  }
  get descriptionCtrl() {
    return this.form.get('description')!;
  }

  // ── Envío ────────────────────────────────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const { name, description, is_active, display_order } = this.form.getRawValue();

    /**
     * Construcción del DTO alineada con CreateCategoryDto del backend:
     *
     *  - restaurant_id  → requerido, viene de storage (el servicio también
     *                     lo sobreescribe internamente, pero lo incluimos
     *                     para satisfacer el tipo CategoryCreate en TS).
     *  - menu_id        → opcional; se omite si storage no lo tiene.
     *  - name           → requerido, se recorta el espacio sobrante.
     *  - description    → opcional en backend; se envía si el usuario lo completó.
     *  - is_active      → opcional; se envía siempre (viene del checkbox).
     *  - display_order  → opcional; solo se envía si el usuario ingresó un valor.
     */
    const dto: CategoryCreate = {
      restaurant_id: this.restaurantId,
      name: name.trim(),
      is_active,

      // Opcionales — solo se añaden al objeto si tienen valor real
      ...(this.menuId ? { menu_id: this.menuId } : {}),
      ...(description?.trim() ? { description: description.trim() } : {}),
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
        } else if (err?.status === 400) {
          this.notification.error('Datos inválidos. Revisa los campos e inténtalo de nuevo.');
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
