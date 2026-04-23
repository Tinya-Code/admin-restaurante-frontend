# Mapeo de Objetos de Configuración (Settings SaaS)

Este documento detalla la estructura de datos utilizada para la configuración global del restaurante y las anulaciones (overrides) específicas de sucursal.

## 1. Configuración de Restaurante (Global)

**Endpoint:** `GET/PUT /settings/restaurant`  
**Modelo:** `BusinessSettings`

Este objeto representa la "Fuente de Verdad" para todas las sucursales.

```json
{
  "restaurant_id": "uuid-v4",
  "logo_url": "https://cloudinary.com/restaurant-logo.png",
  "description": "El mejor pollo a la brasa de la ciudad",
  "whatsapp_config": {
    "enabled": true,
    "number": "912345678",
    "greeting": "¡Hola! Bienvenido a Pollo Real",
    "message_template": "Hola, quisiera hacer un pedido de:",
    "show_prices": true,
    "auto_include_restaurant_name": true
  },
  "order_config": {
    "enabled": true,
    "delivery_enabled": true,
    "pickup_enabled": true,
    "delivery_fee": 5.00,
    "max_order_quantity": 20,
    "payment_methods": ["cash", "yape", "plin", "card"],
    "accepts_reservations": false
  },
  "business_config": {
    "timezone": "America/Lima",
    "social_media": {
      "facebook": "fb.com/polloreal",
      "instagram": "@polloreal_oficial",
      "tiktok": "@polloreal_tips"
    },
    "delivery_zones": [
      { "name": "Zona Central", "fee": 3.00 },
      { "name": "Zona Norte", "fee": 7.50 }
    ],
    "business_hours": {
      "monday": { "open": "09:00", "close": "22:00", "isOpen": true },
      "tuesday": { "open": "09:00", "close": "22:00", "isOpen": true },
      "wednesday": { "open": "09:00", "close": "22:00", "isOpen": true },
      "thursday": { "open": "09:00", "close": "22:00", "isOpen": true },
      "friday": { "open": "09:00", "close": "23:00", "isOpen": true },
      "saturday": { "open": "10:00", "close": "23:30", "isOpen": true },
      "sunday": { "open": "10:00", "close": "20:00", "isOpen": true }
    }
  }
}
```

---

## 2. Configuración de Sucursal (Overrides)

**Endpoint:** `GET/PUT /settings/branch`  
**Modelo:** `BranchSettings`

Este objeto contiene solo los campos que la sucursal desea **anular**. Si un objeto es `null`, la sucursal hereda automáticamente el valor del restaurante.

### Ejemplo: Sucursal con costo de delivery diferente y nombre propio

```json
{
  "description": "Pollo Real - Sede San Isidro (Expertos en Parrillas)",
  "order_config": {
    "delivery_fee": 10.00, 
    "payment_methods": ["cash", "card"] 
  },
  "whatsapp_config": {
    "number": "999888777"
  },
  "schedule": {
    "monday": { "open": "12:00", "close": "23:00", "isOpen": true },
    "sunday": { "open": "00:00", "close": "00:00", "isOpen": false }
  }
}
```

> [!TIP]
> **Herencia Parcial**: Nota que en `order_config` solo enviamos `delivery_fee`. Los demás campos (como `max_order_quantity`) seguirán usando el valor global del restaurante.

---

## 3. Mapeo General y Flujo de Herencia

El sistema realiza un "Deep Merge" para los objetos de configuración y un "Overwrite" para campos planos o de estructura fija como el horario.

| Sección | Lógica | Comportamiento en la UI |
| :--- | :--- | :--- |
| **Banners** | **Independiente** | No existe herencia. Cada sede sube sus propias imágenes. |
| **WhatsApp** | **Merge** | Si la sede no pone número, se usa el del restaurante. |
| **Pedidos** | **Merge** | Útil para sedes en zonas caras que cobran más delivery. |
| **Horario** | **Reemplazo** | Si la sede define `schedule`, se ignora el global totalmente. |
| **Descripción**| **Reemplazo** | Permite diferenciar sedes (ej: "Sede Express" vs "Sede Familiar"). |

---

## 4. Estructura de Horarios (`DayHours`)

```typescript
// Estructura interna de cada día
{
  "open": "09:00",  // HH:mm (24h)
  "close": "22:00", // HH:mm (24h)
  "isOpen": true    // Boolean
}
```
