import { Component } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: false,
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent {
  readonly metrics = [
    { label: 'Today orders', value: '128', note: '+14% vs yesterday' },
    { label: 'Pending invoices', value: '32', note: 'Awaiting checkout' },
    { label: 'Near expiry', value: '18', note: 'Within 60 days' }
  ];
}



