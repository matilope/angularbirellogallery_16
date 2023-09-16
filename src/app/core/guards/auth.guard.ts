import { CanMatchFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthService } from '@shared/services/auth.service';
import decode from 'jwt-decode';

export const AuthGuard: CanMatchFn = () => {
  /*
  const router = inject(Router);
  const _authService = inject(AuthService);
  return _authService.loggedIn().pipe(
    switchMap((response: Validation) => {
      if (response?.code === 200) {
        return of(true);
      } else {
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
  */
  const _router = inject(Router);
  const _authService = inject(AuthService);
  const token = _authService.getToken();
  if (!token) {
    _router.navigate(['/404']);
    return false;
  }
  const tokenPayload: any = decode(token);
  if (tokenPayload?.subject !== environment?.payload) {
    _router.navigate(['/404']);
    return false;
  }
  return true;
}