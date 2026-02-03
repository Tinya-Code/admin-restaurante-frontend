import { Injectable, inject } from '@angular/core';
import { User } from '../models/user.model';
import { Auth as fireAuth, signInWithPopup, GoogleAuthProvider } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  // inyectamos el servicio de autenticacion de firebase
    private auth = inject(fireAuth)

  // metodo para iniciar secion con google
  async loginWithGoogle() :Promise<User | void> {
    const provider = new GoogleAuthProvider();
    const result= await signInWithPopup(this.auth, provider);
    const dataUser: User = {
      uid: result.user.uid,
      email:result.user.email,
      displayName: result.user.displayName,
      photoURL: result.user.photoURL
    };
      // devolvemos el usuario
      // A pesar de que GoogleAuthProvider guarda los datos en localStorage, se considera retornar datauser para posibles usos futuros
    return dataUser;
  }

  // metodo para cerrar secion
  async logOut (): Promise<void> {
    await this.auth.signOut();
  }
}
