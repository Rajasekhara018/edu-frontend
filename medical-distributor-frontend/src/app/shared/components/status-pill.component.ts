import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-pill',
  standalone: false,
  templateUrl: './status-pill.component.html',
  styleUrl: './status-pill.component.scss'
})
export class StatusPillComponent {
  @Input() status = '';

  get tone(): string {
    const normalized = this.status.toLowerCase();
    if (['active', 'paid', 'delivered', 'allocated', 'invoiced'].includes(normalized)) return 'positive';
    if (['blocked', 'expired', 'overdue', 'failed'].includes(normalized)) return 'negative';
    if (['hold', 'pending', 'partial', 'packed', 'dispatched'].includes(normalized)) return 'warning';
    return 'neutral';
  }
}



