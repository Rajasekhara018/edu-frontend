import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusBadgeComponent } from './status-badge.component';
import { BookingStatus } from '../core/models';

interface TimelineEvent {
  status: BookingStatus;
  at: number;
  by: string;
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent],
  template: `
    <ul class="timeline">
      <li *ngFor="let event of events" class="timeline-entry">
        <div>
          <strong>{{ event.status }}</strong>
          <app-status-badge [status]="event.status"></app-status-badge>
        </div>
        <small>{{ event.at | date: 'medium' }} · {{ event.by }}</small>
      </li>
    </ul>
  `,
  styles: [
    ".timeline { list-style: none; padding: 0; margin: 0; }",
    ".timeline-entry { padding: 0.6rem 0; border-bottom: 1px dashed #d1d5db; }",
    ".timeline-entry:last-child { border-bottom: none; }",
    ".timeline-entry strong { margin-right: 0.5rem; font-size: 0.95rem; text-transform: capitalize; }",
    ".timeline-entry small { color: #6b7280; display: block; margin-top: 0.35rem; }",
    ".timeline-entry app-status-badge { margin-left: 0.6rem; }"
  ]
})
export class TimelineComponent {
  @Input() events: TimelineEvent[] = [];
}
