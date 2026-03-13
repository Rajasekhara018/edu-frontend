import { Injectable } from '@angular/core';
import { CanMatch, Route, Router, UrlSegment, UrlTree } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthMatchGuard implements CanMatch {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  canMatch(route: Route, segments: UrlSegment[]): boolean | UrlTree {
    if (!this.authService.isAuthenticated()) {
      return this.router.createUrlTree(['/auth']);
    }

    return true;
  }
}
