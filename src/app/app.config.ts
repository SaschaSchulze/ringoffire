import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'ring-of-fire-fd256',
          appId: '1:308837261938:web:fc237788915147f13ad8eb',
          storageBucket: 'ring-of-fire-fd256.appspot.com',
          apiKey: 'AIzaSyAr6oj-d4eT2kcH-GQFONWSABGud-OlSZM',
          authDomain: 'ring-of-fire-fd256.firebaseapp.com',
          messagingSenderId: '308837261938',
        })
      )
    ),
    importProvidersFrom(provideFirestore(() => getFirestore())),
  ],
};
