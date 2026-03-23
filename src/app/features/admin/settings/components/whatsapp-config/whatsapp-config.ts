import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  WHATSAPP_MESSAGE_MAX_LENGTH,
  WhatsAppConfig as WhatsAppConfigModel,
} from '../../services/settings.models';

@Component({
  selector: 'app-whatsapp-config',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './whatsapp-config.html',
  styleUrl: './whatsapp-config.css',
})
export class WhatsAppConfig implements OnInit {
  config = input<WhatsAppConfigModel>({
    number: '',
    message_template: '',
  });

  configChange = output<WhatsAppConfigModel>();
  isValid = output<boolean>();

  private fb = inject(FormBuilder);
  readonly maxLength = WHATSAPP_MESSAGE_MAX_LENGTH;

  whatsappForm: FormGroup = this.fb.group({
    number: ['', [Validators.required, Validators.pattern(/^[9]\d{8}$/)]],
    message_template: ['', [Validators.required, Validators.maxLength(this.maxLength)]],
  });

  ngOnInit(): void {
    // Emitir cambios y validación
    this.whatsappForm.valueChanges.subscribe((values) => {
      const isValid = this.whatsappForm.valid;
      this.isValid.emit(isValid);

      if (isValid) {
        this.configChange.emit(values as WhatsAppConfigModel);
      }
    });

    if (this.config()) {
      this.whatsappForm.patchValue(this.config(), { emitEvent: false });
      const isValid = this.whatsappForm.valid;
      this.isValid.emit(isValid);
    }
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

  // Obtener mensaje de error para mensaje
  getMessageErrorMessage(): string {
    const control = this.whatsappForm.get('message_template');

    if (control?.errors?.['required']) {
      return 'El mensaje es requerido';
    }

    if (control?.errors?.['maxlength']) {
      return `El mensaje no puede exceder ${this.maxLength} caracteres`;
    }

    return '';
  }

  // Contador de caracteres
  getCharacterCount(): number {
    return this.whatsappForm.get('message_template')?.value?.length || 0;
  }

  // Validar si el formulario es válido
  get isFormValid(): boolean {
    return this.whatsappForm.valid;
  }

  // Obtener valor actual del formulario
  getFormValue(): WhatsAppConfig {
    return this.whatsappForm.value as WhatsAppConfig;
  }
}
