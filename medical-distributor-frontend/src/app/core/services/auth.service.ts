import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

const MOCK_USERS = [
  { username: 'admin', password: 'admin', roles: ['SUPER_ADMIN', 'FINANCE', 'WAREHOUSE'] },
  { username: 'sales', password: 'sales', roles: ['SALES_REP', 'SALES_MANAGER'] }
];

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(username: string, password: string): Observable<AuthResponse> {
    const user = MOCK_USERS.find(u => u.username === username && u.password === password);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const response = this.buildResponse(user.roles);
    this.storeTokens(response);
    return of(response);
  }

  refresh(refreshToken: string): Observable<AuthResponse> {
    const response = this.buildResponse(this.getRoles());
    this.storeTokens(response);
    return of(response);
  }

  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roles');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRoles(): string[] {
    const raw = localStorage.getItem('roles');
    return raw ? JSON.parse(raw) : [];
  }

  private storeTokens(response: AuthResponse): void {
    localStorage.setItem('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    const roles = this.decodeRoles(response.accessToken);
    localStorage.setItem('roles', JSON.stringify(roles));
  }

  private buildResponse(roles: string[]): AuthResponse {
    const payload = {
      roles
    };
    const token = `header.${btoa(JSON.stringify(payload))}.signature`;
    return {
      accessToken: token,
      refreshToken: `${token}-refresh`,
      expiresInSeconds: 3600
    };
  }

  private decodeRoles(token: string): string[] {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (Array.isArray(payload.roles)) {
        return payload.roles;
      }
      return [];
    } catch {
      return [];
    }
  }
}
