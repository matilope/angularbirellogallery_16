import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';

export const AuthGuard = (): boolean => {
  const router = inject(Router);
  const _authService = inject(AuthService);
  if (!_authService.loggedIn()) {
    router.navigate(['/404']);
    return false;
  }
  return true;
}
