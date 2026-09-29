import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

// Sends visitors without a token to /login.
// The server has no token, so it lets the page render and the browser decides.
export const authGuard: CanActivateFn = () => {
  if (!isPlatformBrowser(inject(PLATFORM_ID))) {
    return true;
  }
  return inject(AuthService).getToken() ? true : inject(Router).createUrlTree(['/login']);
};
