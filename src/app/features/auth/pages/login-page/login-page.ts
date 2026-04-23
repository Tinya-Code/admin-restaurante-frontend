import { Component, inject, signal } from '@angular/core';
import { LoginForm } from "../../components/login-form/login-form";
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [LoginForm],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {
  private authService = inject(AuthService);
  
  isLoading = signal(false);

  async loginWithGoogle() {
    this.isLoading.set(true);
    try {
      await this.authService.loginWithGoogle();
    } catch (e) {
      console.error(e);
    } finally {
      this.isLoading.set(false);
    }
  }
}
