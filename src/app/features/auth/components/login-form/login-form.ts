import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule, Utensils, Loader } from 'lucide-angular';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {
  @Input() isLoading = false;
  @Output() onGoogleLogin = new EventEmitter<void>();

  // Iconos
  readonly Utensils = Utensils;
  readonly Loader = Loader;

  /**
   * Inicia sesión con Google
   */
  loginWithGoogle(): void {
    if (this.isLoading) return;
    this.onGoogleLogin.emit();
  }
}