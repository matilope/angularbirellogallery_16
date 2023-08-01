import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "@shared/services/auth.service";

export const interceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  if (token) {
    const tokenizedReq = req.clone({
      headers: req.headers.set(
        'Authorization',
        'bearer ' + token
      )
    });
    return next(tokenizedReq);
  }
  return next(req);
}