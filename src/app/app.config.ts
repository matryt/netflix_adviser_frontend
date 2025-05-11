import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { provideAuth0 } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';
import { CustomAuthService } from './services/auth-service.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(routes),
    provideAuth0({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        redirect_uri: environment.auth.authorizationParams.redirect_uri,
        audience: environment.auth.authorizationParams.audience,
        scope: environment.auth.authorizationParams.scope
      },
      useRefreshTokens: true,
      cacheLocation: 'localstorage',
    }),
    CustomAuthService
  ]
};
