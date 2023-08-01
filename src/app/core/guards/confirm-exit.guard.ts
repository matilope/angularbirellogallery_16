import { CanDeactivateFn } from '@angular/router';

export const confirmExitGuard: CanDeactivateFn<boolean> = (route, state) => {
  return true;
};
