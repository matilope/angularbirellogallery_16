import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PaintingsObservable } from '@core/models/painting';
import { PaintingsService } from '@shared/services/paintings.service';

export const PaintingsResolve: ResolveFn<PaintingsObservable | string> = () => {
  return inject(PaintingsService).getPaintings()
    .pipe(
      catchError(error => {
        return of('No data found');
      })
    );
}
