import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Utensils, Loader } from 'lucide-angular';
import { AuthApiService } from '../../services/auth-api.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  private authService = inject(AuthApiService);

  // Iconos
  readonly Utensils = Utensils;
  readonly Loader = Loader;

  // Estado de carga
  isLoading = signal(false);

  /**
   * Inicia sesión con Google
   */
  async loginWithGoogle(): Promise<void> {
    if (this.isLoading()) return;

    this.isLoading.set(true);
    
    try {
      await this.authService.loginWithGoogle();
    } catch (error) {
      console.error('Error en login:', error);
    } finally {
      this.isLoading.set(false);
    }
  }
}