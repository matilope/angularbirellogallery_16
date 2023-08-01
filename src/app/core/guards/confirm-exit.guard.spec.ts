import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { confirmExitGuard} from './confirm-exit.guard';

describe('confirmExitGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => confirmExitGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
