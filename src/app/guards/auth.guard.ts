import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import {CustomAuthService} from '../services/auth-service.service';
import {firstValueFrom, map} from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(CustomAuthService);

  const isAuthenticated = await firstValueFrom(
    authService.getUser().pipe(
      map(user => user !== null && user !== undefined)
    )
  );

  if (!isAuthenticated) {
    await authService.login();
    return false;
  }

  return true;
};
