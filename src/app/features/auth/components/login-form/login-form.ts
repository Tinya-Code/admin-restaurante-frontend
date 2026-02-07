import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, Utensils, LogIn, Eye, EyeOff, Loader } from 'lucide-angular';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/authService';
import { Notification } from '../../../../core/services/notification';
@Component({
  selector: 'app-login-form',
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private notification = inject(Notification);

  constructor() {}

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  })

  // insertamos iconos de lucide-angular
  readonly Utensils = Utensils;
  readonly LogIn = LogIn
  readonly Eye = Eye;
  readonly EyeOff = EyeOff;
  readonly Loader = Loader;

  // metodo para limpiar el formulario
  claerForm(){
    this.loginForm.reset();
  }
  //variable para controlar la visibilidad de la contraseña
  eyeController = signal(true);
  // metodo paa alterar la visibilidad de la contraseña
  toggleEyeController() {
    this.eyeController.update(value => !value);
  }

  // metodo para enviar el formulario y controlador para modal de carga
  isLoading = signal(false);

   onSubmit(): void {
    this.isLoading.set(true);
    if (this.loginForm.invalid) {
      // si el formulario es invalido notificamos al usuario
      this.notification.error('Por favor, complete el formulario correctamente.');
      this.isLoading.set(false);
      return;
    }
    const { email, password } = this.loginForm.value;
    this.claerForm();
    console.log(`Formulario provado con exito: ${ email } - ${ password }`);
  }

  // metodo para iniciar sesion con google
  async Google(): Promise<boolean | void> {
    // llamamos al servicio de autenticacion de google
    this.isLoading.set(true);
    try {
      await this.authService.loginGoogle();
      this.isLoading.set(false);
      return true;
    } catch (error) {
      console.error('Error al iniciar sesion con Google:', error);
      this.isLoading.set(false);
      return false;
    }
  }
}
