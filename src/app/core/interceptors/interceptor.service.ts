import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@shared/services/auth.service";

export const interceptor: HttpInterceptorFn = (req, next) => {
  let authService = inject(AuthService);
  let tokenizedReq = req.clone({
    headers: req.headers.set(
      'Authorization',
      'bearer ' + authService.getToken()
    )
  });
  return next(tokenizedReq);
}