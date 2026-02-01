import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const roles = route.data['roles'] as string[] | undefined;
    if (!roles || roles.length === 0) {
      return true;
    }
    const userRoles = this.auth.getRoles();
    const allowed = roles.some(role => userRoles.includes(role));
    if (!allowed) {
      this.router.navigate(['/dashboard']);
    }
    return allowed;
  }
}
