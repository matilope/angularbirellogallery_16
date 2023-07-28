import { CanActivateFn } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Validation } from '@core/models/validation';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const _authService = inject(AuthService);
  let state = true;
  _authService.loggedIn().subscribe({
    next: (response: Validation) => {
      if (response.code == 401) {
        router.navigate(['/404']);
        state = false;
      } else {
        state = true;
      }
    },
    error: () => {
      state = false;
    }
  });
  return state;
}