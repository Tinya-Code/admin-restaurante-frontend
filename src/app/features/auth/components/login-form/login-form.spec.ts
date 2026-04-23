import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginForm } from './login-form';
import { LucideAngularModule } from 'lucide-angular';

describe('LoginForm', () => {
  let fixture: ComponentFixture<LoginForm>;
  let component: LoginForm;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginForm, LucideAngularModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onGoogleLogin when loginWithGoogle is called', () => {
    spyOn(component.onGoogleLogin, 'emit');
    
    component.loginWithGoogle();

    expect(component.onGoogleLogin.emit).toHaveBeenCalled();
  });

  it('should prevent emission when isLoading is true', () => {
    spyOn(component.onGoogleLogin, 'emit');
    component.isLoading = true;

    component.loginWithGoogle();

    expect(component.onGoogleLogin.emit).not.toHaveBeenCalled();
  });
});
