import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.model';
import {
  Auth as fireAuth,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser,
  authState
} from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // inyectamos el servicio de autenticacion de firebase
  private auth = inject(fireAuth);
readonly user = toSignal(
  authState(this.auth).pipe(
    map((firebaseUser) =>
      firebaseUser
        ? {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName ?? '',
            email: firebaseUser.email ?? '',
            avatar: firebaseUser.photoURL ?? undefined,
            emailVerified: firebaseUser.emailVerified,
            phoneNumber: firebaseUser.phoneNumber ?? null,
            providerId: firebaseUser.providerId,
            providerData: firebaseUser.providerData,
            isAnonymous: firebaseUser.isAnonymous,
            metadata: {
              creationTime: firebaseUser.metadata.creationTime,
              lastSignInTime: firebaseUser.metadata.lastSignInTime,
            },
          }
        : null
    )
  ),
  { initialValue: null }
);


  // metodo para iniciar secion con google
  async loginWithGoogle(): Promise<User | void> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this.auth, provider);
    const dataUser: User = {
      uid: result.user.uid,
      email: result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL,
    };
    // devolvemos el usuario
    // A pesar de que GoogleAuthProvider guarda los datos en localStorage, se considera retornar datauser para posibles usos futuros
    return dataUser;
  }

  getCurrentUser(): FirebaseUser | null {
    return this.auth.currentUser;
  }
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return this.auth.onAuthStateChanged(callback);
  }

  // metodo para cerrar secion
  async logOut(): Promise<void> {
    await this.auth.signOut();
  }

  // método para obtener el token de autenticación
  async getIdToken(): Promise<string | null> {
    const currentUser = this.auth.currentUser;
    if (!currentUser) {
      return null;
    }
    
    try {
      return await currentUser.getIdToken();
    } catch (error) {
      console.error('Error obteniendo token de autenticación:', error);
      return null;
    }
  }
}
