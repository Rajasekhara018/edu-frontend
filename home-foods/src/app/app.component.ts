import { Component } from '@angular/core';
import { HomeFoodsConfigService } from './Services/home-foods-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'home-foods';

  constructor(public readonly homeFoodsConfig: HomeFoodsConfigService) {}
}

