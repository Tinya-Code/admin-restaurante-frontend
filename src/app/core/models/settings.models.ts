export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

export const DAY_NAMES_ES: Record<DayOfWeek, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
};

export type PaymentMethod = 'cash' | 'card' | 'yape' | 'plin';

export const PAYMENT_METHODS: PaymentMethod[] = ['cash', 'card', 'yape', 'plin'];

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  cash: 'Efectivo',
  card: 'Tarjeta',
  yape: 'Yape',
  plin: 'Plin',
};

export const WHATSAPP_MESSAGE_MAX_LENGTH = 500;
export const MAX_DELIVERY_ZONES = 10;

export interface BusinessHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface DayHours {
  monday: BusinessHours;
  tuesday: BusinessHours;
  wednesday: BusinessHours;
  thursday: BusinessHours;
  friday: BusinessHours;
  saturday: BusinessHours;
  sunday: BusinessHours;
}

export interface DeliveryZone {
  name: string;
  fee: number;
}

export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  twitter?: string;
}

export interface WhatsAppConfig {
  enabled: boolean;
  number: string;
  message_template: string;
  show_prices: boolean;
  greeting?: string;
  auto_include_restaurant_name: boolean;
}

export interface DisplayConfig {
  show_images: boolean;
  show_descriptions: boolean;
  show_categories: boolean;
  currency: string;
  currency_symbol: string;
  theme: 'light' | 'dark' | 'auto';
  colors: {
    primary: string;
    secondary: string;
  };
  language: string;
  show_availability_badge: boolean;
}

export interface OrderConfig {
  enabled: boolean;
  max_order_quantity: number;
  delivery_fee: number;
  payment_methods: string[];
  accepts_reservations: boolean;
  delivery_enabled: boolean;
  pickup_enabled: boolean;
}

export interface BusinessConfig {
  business_hours: DayHours;
  timezone: string;
  delivery_zones: DeliveryZone[];
  social_media: SocialMedia;
}

import { Plan } from './plan.model';

export interface BusinessSettings {
  id: string;
  name: string;
  slug: string;
  phone: string;
  address: string;
  logo_url?: string;
  description?: string;
  plan: Plan;
}

/**
 * Representa la configuración completa de una sucursal.
 */
export interface BranchSettings {
  id: string;
  whatsapp_config: WhatsAppConfig;
  display_config: DisplayConfig;
  order_config: OrderConfig;
  business_config: BusinessConfig;
  schedule: DayHours;
  description?: string;
  logo_url?: string;
  logo_cloudinary_id?: string;
  created_at?: string;
  updated_at?: string;
}

