import { Component } from '@angular/core';
import { StoreConfigService } from './Services/store-config.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(public readonly storeConfig: StoreConfigService) {}
}
