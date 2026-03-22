import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent {
  readonly orderId = this.route.snapshot.paramMap.get('orderId') || 'NA';

  constructor(private readonly route: ActivatedRoute) {}
}
