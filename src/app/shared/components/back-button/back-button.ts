import { Component, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LucideAngularModule, ArrowLeft } from 'lucide-angular';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './back-button.html',
  styleUrl: './back-button.css',
})
export class BackButton {
  /** Texto del botón */
  text = signal('Volver');

  /** Mostrar icono */
  showIcon = signal(true);

  /** Clases personalizadas */
  customClass = signal('');

  /** Etiqueta accesible */
  ariaLabel = signal('Volver a la página anterior');

  /** Icono importado de Lucide */
  readonly icon = ArrowLeft;

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
