import { Injectable, signal } from '@angular/core';

export type ToastLevel = 'success' | 'info' | 'warn' | 'error';

interface ToastMessage {
  id: string;
  level: ToastLevel;
  text: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  readonly toastList = signal<ToastMessage[]>([]);

  show(text: string, level: ToastLevel = 'info', duration = 4000) {
    const id = `toast-${Math.random().toString(36).slice(2, 8)}`;
    this.toastList.set([...this.toastList(), { id, level, text }]);
    setTimeout(() => this.dismiss(id), duration);
  }

  dismiss(id: string) {
    this.toastList.set(this.toastList().filter((toast) => toast.id !== id));
  }
}
