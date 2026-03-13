import { Component } from '@angular/core';
import { SalesConfigService } from './Services/sales-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'electrical-sales';

  constructor(public readonly salesConfig: SalesConfigService) {}
}
