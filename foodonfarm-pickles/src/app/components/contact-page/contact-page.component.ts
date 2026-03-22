import { Component } from '@angular/core';

@Component({
  selector: 'app-contact-page',
  templateUrl: './contact-page.component.html',
  styleUrls: ['./contact-page.component.scss']
})
export class ContactPageComponent {
  readonly contact = {
    phone: '+91 6307909256',
    email: 'info@foodonfarmpickles.com',
    address: [
      'Amaravathi FoodCorp Private Limited',
      '6-117/2, Guruvindupalem, Peddapulivarru Village,',
      'Bhattiprolu Mandal, Bapatla Dist, Andhra Pradesh - 522257'
    ]
  };
}
