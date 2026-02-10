import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginForm } from './login-form';
import { Notification } from '../../../../core/services/notification';
import { AuthService } from '../../services/authService';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginForm', () => {

  let fixture: ComponentFixture<LoginForm>;
  let component: LoginForm;
  let notification: jasmine.SpyObj<Notification>;
  let authService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    notification = jasmine.createSpyObj<Notification>('Notification', ['error']);
    authService = jasmine.createSpyObj<AuthService>('AuthService', ['loginGoogle']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule],
      providers: [
        { provide: Notification, useValue: notification },
        { provide: AuthService, useValue: authService }
      ]
    })
    .compileComponents();

    const fixture = TestBed.createComponent(LoginForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // test para la validacion de datos del formulario
  it(`deve mostrar los string ingresados de password y email`,()=>{
    component.loginForm.setValue({email: `testAngular@gmail.com`, password: `password123`});

    // verificamosque elresultado sea valido
    expect(component.loginForm.value).toEqual({email: `testAngular@gmail.com`, password: `password123`});
  })

  // Test para el metodo onSubmit cuando el formulario es invalido
  it(`mostrar error si el formulario es invalido`, () => {
    component.loginForm.setValue({ email: 'testAngular', password: '12345' });
    component.onSubmit();

    expect(notification.error).toHaveBeenCalledWith('Por favor, complete el formulario correctamente.');
  })
  // test para limpia el formulario
  it(`deebe limpiar campos del formulario`, ()=>{
    component.loginForm.setValue({email: `wordToTest`, password: `passwordToTest`});
    component.claerForm();

    expect(component.loginForm.value).toEqual({email: null, password: null});
    expect(component.loginForm.valid).toBeFalse();
  });
  // test para el metodo activar login google
  it(`debe llamar al servicio de autenticacion google`, async ()=>{
    authService.loginGoogle.and.resolveTo();
    await component.Google();

    expect(authService.loginGoogle).toHaveBeenCalled();
  });

  // test para el metodo activar login google con error
  it('debe manejar error en loginGoogle', async () => {
    authService.loginGoogle.and.rejectWith('Error');

    const result = await component.Google();

    expect(result).toBeFalse();
    expect(component.isLoading()).toBeFalse();
  });

});
