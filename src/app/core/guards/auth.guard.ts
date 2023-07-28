import { CanActivateFn } from '@angular/router';
import { AuthService } from '@shared/services/auth.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { Validation } from '@core/models/validation';

export const AuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const _authService = inject(AuthService);
  return _authService.loggedIn().pipe(
    switchMap((response: Validation) => {
      if (response?.code === 200) {
        return of(true);
      } else {
        router.navigate(['/404']);
        return of(false);
      }
    }),
    catchError((error: any) => {
      console.error('Unauthorized', error);
      router.navigate(['/404']);
      return of(false);
    }),
    map((allowed: boolean) => {
      if (!allowed) {
        router.navigate(['/404']);
      }
      return allowed;
    })
  );
}