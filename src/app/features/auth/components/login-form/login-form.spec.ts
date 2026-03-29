import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginForm } from './login-form';
import { AuthApiService } from '../../services/auth-api.service';
import { LucideAngularModule } from 'lucide-angular';

describe('LoginForm', () => {
  let fixture: ComponentFixture<LoginForm>;
  let component: LoginForm;
  let authService: jasmine.SpyObj<AuthApiService>;

  beforeEach(async () => {
    authService = jasmine.createSpyObj<AuthApiService>('AuthApiService', ['loginWithGoogle']);

    await TestBed.configureTestingModule({
      imports: [LoginForm, LucideAngularModule],
      providers: [
        { provide: AuthApiService, useValue: authService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call authService.loginWithGoogle when loginWithGoogle is called', async () => {
    authService.loginWithGoogle.and.resolveTo();
    
    await component.loginWithGoogle();

    expect(authService.loginWithGoogle).toHaveBeenCalled();
    expect(component.isLoading()).toBeFalse();
  });

  it('should handle error in loginWithGoogle', async () => {
    authService.loginWithGoogle.and.rejectWith(new Error('Login failed'));
    
    await component.loginWithGoogle();

    expect(authService.loginWithGoogle).toHaveBeenCalled();
    expect(component.isLoading()).toBeFalse();
  });

  it('should prevent concurrent login attempts', async () => {
    component.isLoading.set(true);
    authService.loginWithGoogle.calls.reset();

    await component.loginWithGoogle();

    expect(authService.loginWithGoogle).not.toHaveBeenCalled();
  });
});
