import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PortraitObservable } from '@core/models/portrait';
import { PortraitService } from '@shared/services/portrait.service';

export const PortraitResolve: ResolveFn<PortraitObservable | string> = () => {
  return inject(PortraitService).getPortrait("64a4cb571625dd0281b55429")
    .pipe(
      catchError(error => {
        return of('No data found');
      })
    );
}

