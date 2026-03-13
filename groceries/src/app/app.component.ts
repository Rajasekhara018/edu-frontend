import { Component } from '@angular/core';
import { GroceryConfigService } from './Services/grocery-config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'groceries';

  constructor(public readonly groceryConfig: GroceryConfigService) {}
}
