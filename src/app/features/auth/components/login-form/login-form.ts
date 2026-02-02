import { Component, inject, signal } from '@angular/core';
import { LucideAngularModule, Utensils, LogIn, Eye, EyeOff, Loader } from 'lucide-angular';
import { FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../services/authService';
@Component({
  selector: 'app-login-form',
  imports: [LucideAngularModule, ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.css',
})
export class LoginForm {

  private fb = inject(FormBuilder);
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

   onSubmit(): string {
    if (this.loginForm.invalid) {
      return `Formulario invalido`;
    }
    const { email, password } = this.loginForm.value;
    this.claerForm();
    console.log(`Formulario enviado con exito: ${ email } - ${ password }`);
    
    return `Formulario enviado con exito: ${ email } - ${ password }`;
  }

  // metodo para iniciar sesion con google
  async Google(): Promise<boolean | void> {
    // llamamos al servicio de autenticacion de google
  }
}
