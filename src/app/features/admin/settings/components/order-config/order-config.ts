import { CommonModule } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  OrderConfig as OrderConfigModel,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHODS,
  PaymentMethod,
} from '../../services/settings.models';

@Component({
  selector: 'app-order-config',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './order-config.html',
  styleUrl: './order-config.css',
})
export class OrderConfig {
  config = input<OrderConfigModel>({
    enabled: false,
    max_order_quantity: 1,
    delivery_fee: 0,
    payment_methods: [],
    accepts_reservations: false,
    delivery_enabled: false,
    pickup_enabled: false,
  });

  configChange = output<OrderConfigModel>();
  isValid = output<boolean>();

  readonly paymentMethods = PAYMENT_METHODS;
  readonly paymentMethodLabels = PAYMENT_METHOD_LABELS;

  private fb = inject(FormBuilder);

  orderForm = this.fb.group({
    enabled: [false],
    max_order_quantity: [
      1,
      [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)],
    ],
    delivery_fee: [0, [Validators.required, Validators.min(0)]],
    payment_methods: [[] as string[]],
    accepts_reservations: [false],
    delivery_enabled: [false],
    pickup_enabled: [false],
  });

  // Fields to enable/disable when order system is toggled
  private readonly dependentFields = [
    'max_order_quantity',
    'delivery_fee',
    'payment_methods',
    'accepts_reservations',
    'delivery_enabled',
    'pickup_enabled',
  ] as const;

  ngOnInit(): void {
    this.setupFormListeners();
    this.initializeForm();
  }

  private initializeForm(): void {
    if (this.config()) {
      this.orderForm.patchValue(this.config());
    }
    // Initialize disabled state
    this.toggleDependentFields(this.orderForm.get('enabled')?.value === true);
  }

  private setupFormListeners(): void {
    // Value changes listener for validation and config updates
    this.orderForm.valueChanges.subscribe((values) => {
      const isValid = this.orderForm.valid;
      this.isValid.emit(isValid);

      if (isValid) {
        this.configChange.emit({ ...this.config(), ...values } as OrderConfigModel);
      }
    });

    // Enable/disable fields based on order system status
    this.orderForm.get('enabled')?.valueChanges.subscribe((enabled) => {
      this.toggleDependentFields(enabled === true);
    });
  }

  private toggleDependentFields(enable: boolean): void {
    const action = enable ? 'enable' : 'disable';
    this.dependentFields.forEach((field) => {
      this.orderForm.get(field)?.[action]();
    });
  }

  // Payment methods handling
  onPaymentMethodChange(method: PaymentMethod, eventOrChecked: Event | boolean): void {
    const isChecked =
      typeof eventOrChecked === 'boolean'
        ? eventOrChecked
        : (eventOrChecked.target as HTMLInputElement).checked;
    const currentMethods = this.getCurrentPaymentMethods();

    const updatedMethods = isChecked
      ? [...currentMethods, method]
      : currentMethods.filter((m) => m !== method);

    this.orderForm.get('payment_methods')?.setValue(updatedMethods);
  }

  isPaymentMethodSelected(method: PaymentMethod): boolean {
    return this.getCurrentPaymentMethods().includes(method);
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    return this.paymentMethodLabels[method];
  }

  private getCurrentPaymentMethods(): PaymentMethod[] {
    return (this.orderForm.get('payment_methods')?.value as PaymentMethod[]) || [];
  }

  // Form validation helpers
  getControlErrors(controlName: string): Record<string, any> | null {
    return this.orderForm.get(controlName)?.errors || null;
  }

  getErrorMessage(controlName: string, errorType: string, customMessage?: string): string {
    const errors = this.getControlErrors(controlName);
    return errors?.[errorType]
      ? customMessage || this.getDefaultErrorMessage(controlName, errorType)
      : '';
  }

  private getDefaultErrorMessage(controlName: string, errorType: string): string {
    const errorMessages: Record<string, Record<string, string>> = {
      max_order_quantity: {
        required: 'La cantidad máxima es requerida',
        min: 'La cantidad debe ser al menos 1',
        pattern: 'Debe ser un número entero positivo',
      },
      delivery_fee: {
        required: 'El costo de delivery es requerido',
        min: 'El costo debe ser mayor o igual a 0',
      },
      default: {
        required: 'Este campo es requerido',
        min: 'El valor debe ser mayor o igual a 0',
        pattern: 'Formato inválido',
      },
    };

    return (
      errorMessages[controlName]?.[errorType] ||
      errorMessages['default']?.[errorType] ||
      'Error de validación'
    );
  }

  // Public error message methods for template
  getMaxQuantityErrorMessage(): string {
    return (
      this.getErrorMessage('max_order_quantity', 'required') ||
      this.getErrorMessage('max_order_quantity', 'min') ||
      this.getErrorMessage('max_order_quantity', 'pattern')
    );
  }

  getDeliveryFeeErrorMessage(): string {
    return (
      this.getErrorMessage('delivery_fee', 'required') ||
      this.getErrorMessage('delivery_fee', 'min')
    );
  }

  getFieldErrorMessage(field: string): string {
    return (
      this.getErrorMessage(field, 'required') ||
      this.getErrorMessage(field, 'min') ||
      this.getErrorMessage(field, 'pattern')
    );
  }

  // Form state helpers
  get isFormValid(): boolean {
    return this.orderForm.valid;
  }

  get isFormEnabled(): boolean {
    return this.orderForm.get('enabled')?.value === true;
  }

  getFormValue(): OrderConfigModel {
    return this.orderForm.value as OrderConfigModel;
  }

  // Field state helpers
  isFieldDisabled(field: string): boolean {
    return this.orderForm.get(field)?.disabled === true;
  }

  hasFieldErrors(field: string): boolean {
    return this.orderForm.get(field)?.invalid === true;
  }

  isFieldTouched(field: string): boolean {
    return this.orderForm.get(field)?.touched === true;
  }

  // Form actions
  resetForm(): void {
    this.orderForm.reset();
  }
}
