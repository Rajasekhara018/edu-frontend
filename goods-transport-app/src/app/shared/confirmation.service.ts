import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ConfirmationService {
  confirm(message: string) {
    return window.confirm(message);
  }
}
