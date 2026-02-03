import { Injectable, inject } from '@angular/core';
import { Auth } from '../../../core/services/auth';
import { Notification } from '../../../core/services/notification';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    private auth: Auth = inject(Auth)
    private notificaction: Notification = inject(Notification);
    private router: Router = inject(Router);


    async loginGoogle() : Promise < void > {
      try{
        const user = await this.auth.loginWithGoogle();    
        // mostramos nitificacion de exito
        this.notificaction.success(`bienvenido ${user?.displayName}`);
        // redirigimos a la pagina principal
        this.router.navigate([`/admin/home`]);
      }
      catch (error) {
        this.notificaction.error(`Error al iniciar sesion con Google: ${error}`);
    }};

    async closeSession(): Promise<void> {
      try {
        await this.auth.logOut();
      
        // mostramos notifdicacion de exito
        this.notificaction.info('Sesion cerrada correctamente');
            // una vez cerrada la seccion redirigimos a login
        this.router.navigate([`/login`])
      }catch(error){
        this.notificaction.error(`Error al cerrar sesion: ${error}`);
      }
    }
}
