import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch  } from '@angular/common/http';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';

//importamos recursos para conectar a Firebase
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { environment } from '../environments/environment';

// inserción del interceptor
import { AuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes), provideServiceWorker('ngsw-worker.js', {
            enabled: !isDevMode(),
            registrationStrategy: 'registerWhenStable:30000'
          }),
    provideHttpClient(withFetch()),
    AuthInterceptor,

    // usamos provideFirebaseApp para inicializar la app con la configuracion de enviroment
    provideFirebaseApp(()=> initializeApp(environment.firebaseConfig)),
    provideFirestore(()=> getFirestore()),
    provideAuth(()=> getAuth())
  ]
};
