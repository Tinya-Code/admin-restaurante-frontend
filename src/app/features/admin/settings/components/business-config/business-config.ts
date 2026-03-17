import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  OnInit,
  output,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  BusinessConfig as BusinessConfigModel,
  DAY_NAMES_ES,
  DayOfWeek,
  DAYS_OF_WEEK,
  LATAM_TIMEZONES,
  MAX_DELIVERY_ZONES,
} from '../../services/settings.models';

@Component({
  selector: 'app-business-config',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './business-config.html',
  styleUrl: './business-config.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessConfig implements OnInit {
  config = input<BusinessConfigModel>({
    business_hours: {
      monday: { open: '09:00', close: '22:00', isOpen: true },
      tuesday: { open: '09:00', close: '22:00', isOpen: true },
      wednesday: { open: '09:00', close: '22:00', isOpen: true },
      thursday: { open: '09:00', close: '22:00', isOpen: true },
      friday: { open: '09:00', close: '23:00', isOpen: true },
      saturday: { open: '10:00', close: '23:00', isOpen: true },
      sunday: { open: '10:00', close: '20:00', isOpen: true },
    },
    timezone: 'America/Lima',
    delivery_zones: [],
    social_media: {
      facebook: '',
      instagram: '',
      tiktok: '',
    },
  });

  configChange = output<BusinessConfigModel>();
  isValid = output<boolean>();

  private readonly fb = inject(FormBuilder);
  readonly daysOfWeek = DAYS_OF_WEEK;
  readonly dayNames = DAY_NAMES_ES;
  readonly timezones = LATAM_TIMEZONES;
  readonly maxDeliveryZones = MAX_DELIVERY_ZONES;

  businessForm = this.createBusinessForm();

  deliveryZonesCount = computed(() => this.deliveryZonesArray.length);
  canAddMoreZones = computed(() => this.deliveryZonesArray.length < this.maxDeliveryZones);
  isFormValid = computed(() => this.businessForm.valid);

  ngOnInit(): void {
    this.initializeBusinessHours();
    this.setupFormListeners();
    this.patchInitialValues();
  }

  private createBusinessForm(): FormGroup {
    return this.fb.group({
      business_hours: this.fb.group({}),
      timezone: ['America/Lima', Validators.required],
      delivery_zones: this.fb.array([]),
      social_media: this.fb.group({
        facebook: [''],
        instagram: [''],
        tiktok: [''],
      }),
    });
  }

  private setupFormListeners(): void {
    this.businessForm.valueChanges.subscribe((values) => {
      const isValid = this.businessForm.valid;
      this.isValid.emit(isValid);

      if (isValid) {
        this.configChange.emit({ ...this.config(), ...values } as BusinessConfigModel);
      }
    });
  }

  private patchInitialValues(): void {
    if (this.config()) {
      this.initializeDeliveryZones(this.config().delivery_zones);
      this.businessForm.patchValue(this.config());
    }
  }

  private initializeBusinessHours(): void {
    const businessHoursGroup = this.getBusinessHoursGroup();
    this.daysOfWeek.forEach((day) => {
      businessHoursGroup.addControl(day, this.createDayFormGroup());
    });
  }

  private getBusinessHoursGroup(): FormGroup {
    return this.businessForm.get('business_hours') as FormGroup;
  }

  private createDayFormGroup(): FormGroup {
    return this.fb.group(
      {
        open: [
          '09:00',
          [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)],
        ],
        close: [
          '22:00',
          [Validators.required, Validators.pattern(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)],
        ],
        isOpen: [false],
      },
      { validators: this.timeRangeValidator() }
    );
  }

  private timeRangeValidator() {
    return (group: FormGroup) => {
      const openControl = group.get('open');
      const closeControl = group.get('close');
      const isOpenControl = group.get('isOpen');

      // Skip validation if the day is closed
      if (!isOpenControl?.value) {
        return null;
      }

      if (openControl?.value && closeControl?.value) {
        const openTime = this.convertToMinutes(openControl.value);
        const closeTime = this.convertToMinutes(closeControl.value);

        // Cierre debe ser mayor que apertura
        if (closeTime <= openTime) {
          return {
            timeRange: 'La hora de cierre debe ser mayor que la hora de apertura',
          };
        }
      }

      return null;
    };
  }

  private convertToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private initializeDeliveryZones(zones: Array<{ name: string; fee: number }>): void {
    zones.forEach((zone) => {
      this.addDeliveryZone(zone.name, zone.fee);
    });
  }

  get deliveryZonesArray(): FormArray {
    return this.businessForm.get('delivery_zones') as FormArray;
  }

  addDeliveryZone(name = '', fee = 0): void {
    if (this.canAddMoreZones()) {
      this.deliveryZonesArray.push(
        this.fb.group({
          name: [name, Validators.required],
          fee: [fee, [Validators.required, Validators.min(0)]],
        })
      );
    }
  }

  removeDeliveryZone(index: number): void {
    this.deliveryZonesArray.removeAt(index);
  }

  getDayName(day: DayOfWeek): string {
    return this.dayNames[day];
  }

  onDayIsOpenChange(day: DayOfWeek, event: Event): void {
    const target = event.target as HTMLInputElement;
    const dayGroup = this.getDayFormGroup(day);

    if (!dayGroup) return;

    const openControl = dayGroup.get('open');
    const closeControl = dayGroup.get('close');

    if (!target.checked) {
      openControl?.disable();
      closeControl?.disable();
    } else {
      openControl?.enable();
      closeControl?.enable();
    }
  }

  private getDayFormGroup(day: DayOfWeek): FormGroup | null {
    const control = this.businessForm.get(`business_hours.${day}`);
    return control as FormGroup | null;
  }

  isDayOpen(day: DayOfWeek): boolean {
    return this.businessForm.get(`business_hours.${day}.isOpen`)?.value === true;
  }

  validateTimeFormat(time: string): boolean {
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  getTimeErrorMessage(controlName: string): string {
    const control = this.businessForm.get(controlName);

    if (control?.hasError('required')) {
      return 'La hora es requerida';
    }

    if (control?.hasError('pattern')) {
      return 'Formato inválido (HH:MM)';
    }

    return '';
  }

  getDayTimeRangeError(day: DayOfWeek): string {
    const dayGroup = this.getDayFormGroup(day);

    if (dayGroup?.hasError('timeRange')) {
      return dayGroup.getError('timeRange');
    }

    return '';
  }

  getDeliveryZoneErrorMessage(index: number, field: string): string {
    const control = this.deliveryZonesArray.at(index).get(field);

    if (control?.hasError('required')) {
      return field === 'name' ? 'El nombre es requerido' : 'El costo es requerido';
    }

    if (control?.hasError('min')) {
      return 'El costo debe ser mayor o igual a 0';
    }

    return '';
  }

  validateSocialMediaUrl(url: string): boolean {
    if (!url) return true;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  getSocialMediaErrorMessage(field: string): string {
    const control = this.businessForm.get(`social_media.${field}`);

    if (control?.hasError('pattern')) {
      return 'URL inválida';
    }

    return '';
  }

  getFormValue(): BusinessConfig {
    return this.businessForm.value as BusinessConfig;
  }
}
