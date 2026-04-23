import { Component, effect, inject, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, CheckCircle2, Clock, Info, AlertCircle } from 'lucide-angular';
import {
  OrderConfig as OrderConfigModel,
  PaymentMethod,
  PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from '../../../../../core/models/settings.models';

@Component({
  selector: 'app-order-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './order-config.html',
})
export class OrderConfigComponent implements OnInit {
  config = input<OrderConfigModel>({
    enabled: false,
    max_order_quantity: 1,
    accepts_reservations: false,
    pickup_enabled: false,
    delivery_enabled: false,
    delivery_fee: 0,
    payment_methods: [],
  });

  readOnly = input<boolean>(false);

  configChange = output<OrderConfigModel>();
  isValid = output<boolean>();

  readonly CheckCircle2Icon = CheckCircle2;
  readonly ClockIcon = Clock;
  readonly InfoIcon = Info;
  readonly AlertCircleIcon = AlertCircle;

  readonly paymentMethods = PAYMENT_METHODS;

  private fb = inject(FormBuilder);

  orderForm: FormGroup = this.fb.group({
    enabled: [false],
    max_order_quantity: [1, [Validators.required, Validators.min(1)]],
    accepts_reservations: [false],
    pickup_enabled: [false],
    delivery_enabled: [false],
    delivery_fee: [0, [Validators.required, Validators.min(0)]],
    payment_methods: [[]],
  });

  constructor() {
    effect(() => {
      const config = this.config();
      if (config) {
        this.orderForm.patchValue(config, { emitEvent: false });
      }

      if (this.readOnly()) {
        this.orderForm.disable({ emitEvent: false });
      } else {
        this.orderForm.enable({ emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.setupFormListeners();
    // Emit initial status
    this.isValid.emit(this.orderForm.valid);
  }

  private setupFormListeners(): void {
    this.orderForm.valueChanges.subscribe((values) => {
      if (this.readOnly()) return;

      const isValid = this.orderForm.valid;
      this.isValid.emit(isValid);

      if (isValid) {
        this.configChange.emit({ ...this.config(), ...values } as OrderConfigModel);
      }
    });
  }

  get isFormEnabled(): boolean {
    return this.orderForm.get('enabled')?.value;
  }

  isPaymentMethodSelected(method: PaymentMethod): boolean {
    const selected = this.orderForm.get('payment_methods')?.value || [];
    return selected.includes(method);
  }

  onPaymentMethodChange(method: PaymentMethod, event: any): void {
    const isChecked = typeof event === 'boolean' ? event : event.target.checked;
    const current = this.orderForm.get('payment_methods')?.value || [];
    let updated;

    if (isChecked) {
      updated = [...current, method];
    } else {
      updated = current.filter((m: string) => m !== method);
    }

    this.orderForm.get('payment_methods')?.setValue(updated);
  }

  getPaymentMethodLabel(method: PaymentMethod): string {
    return PAYMENT_METHOD_LABELS[method as keyof typeof PAYMENT_METHOD_LABELS] || method;
  }

  getMaxQuantityErrorMessage(): string {
    const control = this.orderForm.get('max_order_quantity');
    if (control?.errors?.['required']) return 'La cantidad máxima es requerida';
    if (control?.errors?.['min']) return 'Debe ser al menos 1';
    return '';
  }

  getDeliveryFeeErrorMessage(): string {
    const control = this.orderForm.get('delivery_fee');
    if (control?.errors?.['required']) return 'El costo de delivery es requerido';
    if (control?.errors?.['min']) return 'Debe ser mayor o igual a 0';
    return '';
  }
}
