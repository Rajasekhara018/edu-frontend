import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';
import { Role } from './models';

@Injectable({ providedIn: 'root' })
export class RoleMatchGuard implements CanMatch {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canMatch(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    const user = this.authService.getSessionUser();
    const requiredRole = route.data?.role as Role | Role[] | undefined;

    if (!requiredRole) {
      return true;
    }

    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user || !allowedRoles.includes(user.role)) {
      return this.router.createUrlTree(['/auth']);
    }

    return true;
  }
}
