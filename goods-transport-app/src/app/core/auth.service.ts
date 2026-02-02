import { Injectable, signal, computed } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Role, User } from './models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly sessionSignal = signal<User | null>(null);
  readonly session = computed(() => this.sessionSignal());
  readonly isAuthenticated = computed(() => Boolean(this.sessionSignal()));

  constructor(private readonly storage: LocalStorageService) {
    this.resumeSession();
  }

  private resumeSession() {
    const stored = this.storage.read<User | null>('app_session', null);
    this.sessionSignal.set(stored);
  }

  private createId() {
    return `id-${Math.random().toString(36).slice(2, 11)}`;
  }

  login(payload: { name: string; phone: string; role: Role; email?: string; vehicleInfo?: { type: string; number: string } }) {
    const users = this.storage.read<User[]>('app_users', []);
    let existing = users.find((u) => u.phone === payload.phone && u.role === payload.role);
    if (!existing) {
      existing = { id: this.createId(), ...payload };
      this.storage.write('app_users', [...users, existing]);
    }
    this.sessionSignal.set(existing);
    this.storage.write('app_session', existing);
  }

  logout() {
    this.sessionSignal.set(null);
    this.storage.write('app_session', null);
  }

  getUsers() {
    return this.storage.read<User[]>('app_users', []);
  }

  getSessionUser() {
    return this.sessionSignal();
  }

  setSession(user: User) {
    this.sessionSignal.set(user);
    this.storage.write('app_session', user);
  }
}
