import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@shared/services/auth.service";

export const interceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  let authService = inject(AuthService);
  let token = authService.getToken();
  if (token) {
    var tokenizedReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'bearer ' + token
      )
    });
  }
  return next(tokenizedReq || req);
}