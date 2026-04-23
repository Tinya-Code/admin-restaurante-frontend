import { Injectable, signal } from '@angular/core';
import { User as FirebaseUser } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

export interface AuthUser {
  id: string;
  email: string;
  displayName?: string;
  photoUrl?: string;
  phone?: string;
  activeContext: 'owner' | 'admin' | 'staff' | 'super_admin';
  globalRoles?: string[];
  createdAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthStateService {
  private stateSubject = new BehaviorSubject<AuthState>({
    user: null,
    firebaseUser: null,
    isAuthenticated: false,
    isLoading: true,
  });

  public state$ = this.stateSubject.asObservable();
  
  // Expose signals for convenience in templates (optional, but requested by some components)
  public user = signal<AuthUser | null>(null);

  get currentState(): AuthState {
    return this.stateSubject.value;
  }

  get currentUser(): AuthUser | null {
    return this.currentState.user;
  }

  get isAuthenticated(): boolean {
    return this.currentState.isAuthenticated;
  }

  get isLoading(): boolean {
    return this.currentState.isLoading;
  }

  setAuthState(state: Partial<AuthState>): void {
    const nextState = { ...this.currentState, ...state };
    this.stateSubject.next(nextState);
    if (state.user !== undefined) {
      this.user.set(state.user);
    }
  }

  clearState(): void {
    this.setAuthState({
      user: null,
      firebaseUser: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }
}
