// Constants
export const MAX_DELIVERY_ZONES = 20;
export const WHATSAPP_MESSAGE_MAX_LENGTH = 100;

// Timezones for America Latina
export const LATAM_TIMEZONES = [
  'America/Mexico_City',
  'America/Guatemala',
  'America/El_Salvador',
  'America/San_Jose',
  'America/Panama',
  'America/Bogota',
  'America/Caracas',
  'America/Guayaquil',
  'America/Lima',
  'America/La_Paz',
  'America/Santiago',
  'America/Asuncion',
  'America/Montevideo',
  'America/Argentina/Buenos_Aires',
  'America/Sao_Paulo',
];

// Payment methods (fijos)
export const PAYMENT = {
  cash: 'cash',
  card: 'card',
  yape: 'yape',
  plin: 'plin',
} as const;
export const PAYMENT_METHODS = Object.values(PAYMENT);
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT.cash]: 'Efectivo',
  [PAYMENT.card]: 'Tarjeta',
  [PAYMENT.yape]: 'Yape',
  [PAYMENT.plin]: 'Plin',
} as const;

// Days of week
export const DAY_VALUES = {
  monday: 'monday',
  tuesday: 'tuesday',
  wednesday: 'wednesday',
  thursday: 'thursday',
  friday: 'friday',
  saturday: 'saturday',
  sunday: 'sunday',
} as const;
export const DAYS_OF_WEEK = Object.values(DAY_VALUES);
export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

// Day names in Spanish for pipes
export const DAY_NAMES_ES = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
} as const;

// WhatsApp Config
export interface WhatsAppConfig {
  number: string;
  message_template: string;
}

// Order Config
export interface OrderConfig {
  enabled: boolean;
  max_order_quantity: number;
  delivery_fee: number;
  payment_methods: PaymentMethod[];
  accepts_reservations: boolean;
  delivery_enabled: boolean;
  pickup_enabled: boolean;
}

// Business Config
export interface BusinessConfig {
  business_hours: {
    [key in DayOfWeek]: {
      open: string; // HH:MM
      close: string; // HH:MM
      isOpen: boolean;
    };
  };
  timezone: string; // de LATAM_TIMEZONES
  delivery_zones: Array<{
    name: string;
    fee: number;
  }>;
  social_media: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
}

// Main settings interface
export interface BusinessSettings {
  id?: number;
  whatsapp_config: WhatsAppConfig;
  order_config: OrderConfig;
  business_config: BusinessConfig;
  created_at?: string;
  updated_at?: string;
}

// Form interfaces para reactive forms
export interface WhatsAppConfigForm {
  number: string;
  message_template: string;
}

export interface OrderConfigForm {
  enabled: boolean;
  max_order_quantity: number;
  delivery_fee: number;
  payment_methods: PaymentMethod[];
  accepts_reservations: boolean;
  delivery_enabled: boolean;
  pickup_enabled: boolean;
}

export interface BusinessConfigForm {
  business_hours: {
    [key in DayOfWeek]: {
      open: string;
      close: string;
      closed: boolean;
    };
  };
  timezone: string;
  delivery_zones: Array<{
    name: string;
    fee: number;
  }>;
  social_media: {
    facebook?: string;
    instagram?: string;
    tiktok?: string;
  };
}
