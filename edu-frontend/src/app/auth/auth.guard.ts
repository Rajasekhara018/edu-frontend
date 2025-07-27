import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { PayeaseAuthService } from '../shared/services/payease-auth-service';


export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
) => {
  let url: string = state.url;
  return inject(PayeaseAuthService).canActivate(url);
};

