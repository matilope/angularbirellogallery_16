import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InstagramService } from '@shared/services/instagram.service';
import { TokenObservable } from '@core/models/token';

export const TokenResolve: ResolveFn<TokenObservable | string> = () => {
  return inject(InstagramService).getToken("625b1c29ac7355062c33afe1")
    .pipe(
      catchError(error => {
        return of('No data found');
      })
    );
}
