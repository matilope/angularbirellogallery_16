import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaintingObservable } from '@core/models/painting';
import { PaintingsService } from '@shared/services/paintings.service';

export const PaintingResolve: ResolveFn<PaintingObservable | string> = (route: ActivatedRouteSnapshot) => {
  let pinturaId = route.params['id'];
  return inject(PaintingsService).getPainting(pinturaId)
    .pipe(
      catchError(error => {
        return of('No data found');
      })
    );
}
