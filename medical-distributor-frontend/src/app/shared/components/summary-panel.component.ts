import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-summary-panel',
  standalone: false,
  templateUrl: './summary-panel.component.html',
  styleUrl: './summary-panel.component.scss'
})
export class SummaryPanelComponent {
  @Input() title = '';
}



