# Componente Modal Dialog

Un componente de diálogo modal reutilizable y accesible para aplicaciones Angular construido con señales y valores calculados modernos de Angular.

## Características

- **Accesibilidad**: Soporte completo de ARIA con roles y etiquetas apropiadas
- **Navegación por Teclado**: Gestión automática del enfoque al abrir
- **Interacción con Fondo**: Configurable para cerrar al hacer clic en el fondo
- **Angular Moderno**: Usa señales, valores calculados y detección de cambios OnPush
- **Diseño Responsivo**: Estilo limpio y minimalista

## Instalación

El componente es independiente y no requiere dependencias adicionales más allá del núcleo de Angular.

## Uso Básico

```typescript
import { Component } from '@angular/core';
import { ModalDialog } from './modal-dialog/modal-dialog.component';

@Component({
  selector: 'app-example',
  standalone: true,
  imports: [ModalDialog],
  template: `
    <button (click)="openModal()">Abrir Modal</button>

    <app-modal-dialog [open]="isModalOpen" [title]="'Modal de Ejemplo'" (closed)="onModalClosed()">
      <p>Este es el contenido del modal.</p>
      <button (click)="closeModal()">Cerrar</button>
    </app-modal-dialog>
  `,
})
export class ExampleComponent {
  isModalOpen = false;

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  onModalClosed() {
    this.isModalOpen = false;
  }
}
```

## Referencia de API

### Entradas

| Entrada           | Tipo             | Por Defecto | Descripción                                       |
| ----------------- | ---------------- | ----------- | ------------------------------------------------- |
| `open`            | `boolean`        | `false`     | Controla si el modal es visible                   |
| `title`           | `string \| null` | `null`      | Título opcional mostrado en la cabecera del modal |
| `closeOnBackdrop` | `boolean`        | `true`      | Si hacer clic en el fondo cierra el modal         |

### Salidas

| Salida   | Tipo   | Descripción                                                                |
| -------- | ------ | -------------------------------------------------------------------------- |
| `closed` | `void` | Emitido cuando el modal se cierra (vía botón cerrar, fondo o programático) |

### Métodos

| Método    | Tipo de Retorno | Descripción                                                  |
| --------- | --------------- | ------------------------------------------------------------ |
| `close()` | `void`          | Cierra el modal programáticamente y emite el evento `closed` |

## Estilos

El componente usa clases CSS con el prefijo `modal-`. Puedes personalizar la apariencia sobreescribiendo estos estilos:

```css
.backdrop {
  /* Estilos del fondo */
}

.modal {
  /* Contenedor principal del modal */
}

.modal__header {
  /* Sección de cabecera */
}

.modal__content {
  /* Área de contenido */
}

.close-btn {
  /* Botón de cerrar */
}
```

## Accesibilidad

- El modal tiene `role="dialog"` y `aria-modal="true"`
- Cuando se proporciona un título, se asocia apropiadamente con `aria-labelledby`
- El enfoque se mueve automáticamente al primer elemento enfocable al abrir
- El botón de cerrar tiene `aria-label` apropiado para lectores de pantalla

## Ejemplos

### Modal con Contenido Personalizado

```html
<app-modal-dialog
  [open]="showFormModal"
  [title]="'Formulario de Usuario'"
  (closed)="showFormModal = false"
>
  <form (ngSubmit)="submitForm()">
    <label for="name">Nombre:</label>
    <input id="name" type="text" [(ngModel)]="user.name" />

    <label for="email">Email:</label>
    <input id="email" type="email" [(ngModel)]="user.email" />

    <button type="submit">Enviar</button>
    <button type="button" (click)="showFormModal = false">Cancelar</button>
  </form>
</app-modal-dialog>
```

### Modal sin Cierre por Fondo

```html
<app-modal-dialog
  [open]="showImportantModal"
  [title]="'Aviso Importante'"
  [closeOnBackdrop]="false"
  (closed)="showImportantModal = false"
>
  <p>Este modal requiere acción explícita para cerrar.</p>
  <button (click)="showImportantModal = false">Entendido</button>
</app-modal-dialog>
```

### Modal Minimalista (Sin Título)

```html
<app-modal-dialog [open]="showMinimalModal" (closed)="showMinimalModal = false">
  <p>Modal simple sin cabecera de título.</p>
  <button (click)="showMinimalModal = false">Cerrar</button>
</app-modal-dialog>
```

## Mejores Prácticas

1. **Proporcionar siempre un mecanismo de cierre** - Ya sea a través del botón cerrar, clic en el fondo o botones personalizados
2. **Usar títulos significativos** - Cuando proporciones un título, hazlo descriptivo del propósito del modal
3. **Gestionar el enfoque** - El componente maneja el enfoque automáticamente, pero asegúrate de que tu contenido tenga elementos enfocables
4. **Considerar usuarios móviles** - Prueba el comportamiento del modal en pantallas más pequeñas
5. **Evitar modales anidados** - Esto puede causar problemas de accesibilidad

## Soporte de Navegadores

Este componente soporta todos los navegadores modernos que soportan los requisitos actuales de Angular.
