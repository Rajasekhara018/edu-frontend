import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresInSeconds: number;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, { username, password }).pipe(
      tap(response => this.storeTokens(response))
    );
  }

  refresh(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/refresh`, { refreshToken }).pipe(
      tap(response => this.storeTokens(response))
    );
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

  private decodeRoles(token: string): string[] {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      if (Array.isArray(payload.roles)) {
        return payload.roles;
      }
      if (Array.isArray(payload.authorities)) {
        return payload.authorities;
      }
      return [];
    } catch {
      return [];
    }
  }
}
