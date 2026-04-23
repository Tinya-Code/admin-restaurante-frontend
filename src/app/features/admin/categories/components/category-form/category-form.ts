import { Component, OnInit, input, output, effect, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, CircleAlert, LoaderCircle, Sparkles } from 'lucide-angular';
import { Category, CategoryCreate, CategoryUpdate, CategoryType } from '../../../../../core/models/category.model';
import { CategoryService } from '../../services/category.service';

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
  readonly Sparkles = Sparkles;

  // ── Dependencias ─────────────────────────────────────────────────────────
  private fb = inject(FormBuilder);
  private categoryService = inject(CategoryService);

  // ── Inputs y Outputs ─────────────────────────────────────────────────────
  readonly category = input<Category | undefined>(undefined);
  readonly loading = input<boolean>(false);

  readonly formSubmit = output<{ data: CategoryCreate | CategoryUpdate }>();
  readonly formCancel = output<void>();

  // ── Estado ───────────────────────────────────────────────────────────────
  form!: FormGroup;
  isSubmitting = false;
  private isEditMode = false;

  // Tipos de categoría y sugerencias
  categoryTypes = signal<CategoryType[]>([]);
  selectedType = signal<CategoryType | null>(null);
  
  suggestions = computed(() => {
    const type = this.selectedType();
    return type?.metadata?.suggestions || [];
  });

  constructor() {
    effect(() => {
      const category = this.category();
      const types = this.categoryTypes();

      if (category && this.form && types.length > 0) {
        this.isEditMode = true;
        
        // Encontrar el tipo correspondiente si existe
        if (category.type_id) {
          const type = types.find(t => t.id === category.type_id);
          if (type) this.selectedType.set(type);
        }

        this.form.patchValue({
          type_id: category.type_id || '',
          name: category.name,
          description: category.description,
          is_active: category.is_active,
          display_order: category.display_order,
        });
      }
    });

    // Efecto para actualizar el tipo seleccionado cuando cambia el valor del form
    effect(() => {
      if (!this.form) return;
    }, { allowSignalWrites: true });
  }

  // ── Ciclo de vida ────────────────────────────────────────────────────────
  ngOnInit(): void {
    this.initForm();
    this.loadCategoryTypes();
    
    // Escuchar cambios en type_id para actualizar el selectedType
    this.form.get('type_id')?.valueChanges.subscribe(typeId => {
      if (!typeId) {
        this.selectedType.set(null);
        return;
      }
      const type = this.categoryTypes().find(t => t.id === typeId);
      this.selectedType.set(type || null);
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      type_id: [''],
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(500)]],
      is_active: [true],
      display_order: [null],
    });
  }

  private loadCategoryTypes(): void {
    this.categoryService.getCategoryTypes().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.categoryTypes.set(response.data);
        }
      }
    });
  }

  // ── Getters para el template ──────────────────────────────────────────────
  get nameCtrl() {
    return this.form.get('name')!;
  }
  get descriptionCtrl() {
    return this.form.get('description')!;
  }
  get typeIdCtrl() {
    return this.form.get('type_id')!;
  }

  // ── Acciones ──────────────────────────────────────────────────────────────
  onSelectSuggestion(suggestion: string): void {
    this.form.patchValue({ name: suggestion });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { type_id, name, description, is_active, display_order } = this.form.getRawValue();

    const baseData = {
      type_id: type_id || null,
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
