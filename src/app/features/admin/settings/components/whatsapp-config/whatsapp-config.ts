import { Component, effect, inject, input, OnInit, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LucideAngularModule, MessageSquare, Info } from 'lucide-angular';

import {
  WhatsAppConfig as WhatsAppConfigModel,
  WHATSAPP_MESSAGE_MAX_LENGTH,
} from '../../../../../core/models/settings.models';

@Component({
  selector: 'app-whatsapp-config',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './whatsapp-config.html',
})
export class WhatsAppConfigComponent implements OnInit {
  config = input<WhatsAppConfigModel>({
    enabled: false,
    number: '',
    message_template: '',
    show_prices: true,
    greeting: '',
    auto_include_restaurant_name: true,
  });

  readOnly = input<boolean>(false);

  configChange = output<WhatsAppConfigModel>();
  isValid = output<boolean>();

  readonly MessageSquareIcon = MessageSquare;
  readonly InfoIcon = Info;
  readonly maxLength = WHATSAPP_MESSAGE_MAX_LENGTH;
  private fb = inject(FormBuilder);

  whatsappForm: FormGroup = this.fb.group({
    enabled: [false],
    number: ['', [Validators.required, Validators.pattern(/^[9]\d{8}$/)]],
    message_template: ['', [Validators.required, Validators.maxLength(this.maxLength)]],
    show_prices: [true],
    greeting: [''],
    auto_include_restaurant_name: [true],
  });

  constructor() {
    effect(() => {
      const config = this.config();
      if (config) {
        this.whatsappForm.patchValue(config, { emitEvent: false });
      }

      if (this.readOnly()) {
        this.whatsappForm.disable({ emitEvent: false });
      } else {
        this.whatsappForm.enable({ emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.setupFormListeners();
    // Emit initial status
    this.isValid.emit(this.whatsappForm.valid);
  }

  private setupFormListeners(): void {
    this.whatsappForm.valueChanges.subscribe((values) => {
      if (this.readOnly()) return;

      const isValid = this.whatsappForm.valid;
      this.isValid.emit(isValid);

      if (isValid) {
        this.configChange.emit({ ...this.config(), ...values } as WhatsAppConfigModel);
      }
    });
  }

  // Formatear número de WhatsApp
  onNumberInput(event: any): void {
    let value = event.target.value;

    // Remover caracteres no numéricos
    value = value.replace(/\D/g, '');

    // Limitar a 9 dígitos
    value = value.slice(0, 9);

    // Actualizar el valor
    this.whatsappForm.get('number')?.setValue(value, { emitEvent: false });
  }

  // Obtener mensaje de error para número
  getNumberErrorMessage(): string {
    const control = this.whatsappForm.get('number');

    if (control?.errors?.['required']) {
      return 'El número de WhatsApp es requerido';
    }

    if (control?.errors?.['pattern']) {
      return 'El número debe comenzar con 9 y tener 9 dígitos';
    }

    return '';
  }

  // Obtener mensaje de error para plantilla
  getMessageErrorMessage(): string {
    const control = this.whatsappForm.get('message_template');

    if (control?.errors?.['required']) {
      return 'La plantilla de mensaje es requerida';
    }

    if (control?.errors?.['maxlength']) {
      return `La plantilla no debe exceder los ${this.maxLength} caracteres`;
    }

    return '';
  }

  // Obtener conteo de caracteres
  getCharacterCount(): number {
    return this.whatsappForm.get('message_template')?.value?.length || 0;
  }
}
