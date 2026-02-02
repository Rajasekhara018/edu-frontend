import { inject, Injectable } from '@angular/core';
import { CanMatch, Route, UrlSegment, Router } from '@angular/router';
import { AuthService } from '../core/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanMatch {
  canMatch(route: Route, segments: UrlSegment[]) {
    const authService = inject(AuthService);
    const router = inject(Router);
    if (!authService.isAuthenticated()) {
      router.navigate(['/auth']);
      return false;
    }
    return true;
  }
}
