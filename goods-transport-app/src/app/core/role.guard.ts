import { inject, Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Role } from './models';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanMatch {
  canMatch(route: Route, segments: UrlSegment[]) {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.getSessionUser();
    const requiredRole = route.data?.role as Role | Role[] | undefined;
    if (!requiredRole) {
      return true;
    }
    const allowed = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!user || !allowed.includes(user.role)) {
      router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}
