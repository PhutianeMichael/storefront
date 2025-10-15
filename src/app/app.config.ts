import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideState, provideStore } from '@ngrx/store';
import { authFeatureKey, authReducer } from './feature/auth/state/auth.reducer';
import { provideEffects } from '@ngrx/effects';
import { AuthEffects } from './feature/auth/state/auth.effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideHttpClient } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService } from './in-memory-data.service';
import { productFeatureKey, productReducer } from './feature/product/state/product.reducer';
import { ProductEffects } from './feature/product/state/product.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(routes),
    provideHttpClient(),
    provideStore(),
    provideState(productFeatureKey, productReducer),
    provideState(authFeatureKey, authReducer),
    provideEffects([ProductEffects, AuthEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
    }),
    importProvidersFrom(HttpClientInMemoryWebApiModule.forRoot(InMemoryDataService, {
      delay: 500,
      passThruUnknownUrl: true,
    })),
  ],
};
