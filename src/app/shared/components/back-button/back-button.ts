import { Component, Input } from '@angular/core';
import { CommonModule, Location } from '@angular/common';

/**
 * BackButton
 * 
 * Componente reutilizable que proporciona un botón de navegación hacia atrás
 * utilizando el historial del navegador a través del servicio Location de Angular.
 * 
 * @example
 * ```html
 * <!-- Uso básico -->
 * <app-back-button></app-back-button>
 * 
 * <!-- Con texto personalizado -->
 * <app-back-button [text]="'Regresar'"></app-back-button>
 * 
 * <!-- Con icono deshabilitado -->
 * <app-back-button [showIcon]="false"></app-back-button>
 * 
 * <!-- Con clase CSS personalizada -->
 * <app-back-button [customClass]="'btn-primary'"></app-back-button>
 * ```
 */

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './back-button.html',
  styleUrl: './back-button.css',
})
export class BackButton {
  /**
   * Texto que se muestra en el botón
   * @default 'Volver'
   */
  @Input() text: string = 'Volver';

  /**
   * Determina si se muestra el icono de flecha
   * @default true
   */
  @Input() showIcon: boolean = true;

  /**
   * Clase CSS adicional para personalizar el estilo del botón
   * @default ''
   */
  @Input() customClass: string = '';

  /**
   * Título del atributo HTML para accesibilidad
   * @default 'Volver a la página anterior'
   */
  @Input() ariaLabel: string = 'Volver a la página anterior';

  constructor(private location: Location) {}

  /**
   * Navega a la página anterior en el historial del navegador
   * Utiliza el servicio Location de Angular para mantener
   * la compatibilidad con el sistema de rutas
   */
  goBack(): void {
    this.location.back();
  }
}
