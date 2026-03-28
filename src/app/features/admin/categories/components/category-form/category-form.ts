import { Component, OnInit, input, output, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, CircleAlert, LoaderCircle } from 'lucide-angular';
import { Category, CategoryCreate, CategoryUpdate } from '../../../../../core/models/category.model';

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

  // ── Inputs y Outputs ─────────────────────────────────────────────────────
  readonly category = input<Category | undefined>(undefined);
  readonly loading = input<boolean>(false);

  readonly formSubmit = output<{ data: CategoryCreate | CategoryUpdate }>();
  readonly formCancel = output<void>();

  // ── Estado ───────────────────────────────────────────────────────────────
  form!: FormGroup;
  isSubmitting = false; // Mantenido por compatibilidad de UI, aunque idealmente debería usar `loading`
  private isEditMode = false;

  constructor() {
    effect(() => {
      const category = this.category();
      if (category && this.form) {
        this.isEditMode = true;
        this.form.patchValue({
          name: category.name,
          description: category.description,
          is_active: category.is_active,
          display_order: category.display_order,
        });
      }
    });
  }

  // ── Ciclo de vida ────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.form = this.fb.group({
      // Campos obligatorios
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],

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

    const { name, description, is_active, display_order } = this.form.getRawValue();

    const baseData = {
      name: (name as string).trim(),
      description: (description as string).trim(),
      is_active: is_active as boolean,
      ...(display_order !== null && display_order !== '' ? { display_order: Number(display_order) } : {}),
    };

    if (this.isEditMode) {
      this.formSubmit.emit({
        data: {
          id: this.category()!.id,
          ...baseData,
        } as CategoryUpdate,
      });
    } else {
      this.formSubmit.emit({
        data: {
          ...baseData,
        } as CategoryCreate,
      });
    }
  }

  onCancel(): void {
    this.formCancel.emit();
  }
}
