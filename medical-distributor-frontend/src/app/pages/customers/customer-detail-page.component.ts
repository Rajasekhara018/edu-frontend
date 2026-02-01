import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService, Customer } from '../../core/services/customer.service';

@Component({
  selector: 'app-customer-detail-page',
  standalone: false,
  templateUrl: './customer-detail-page.component.html',
  styleUrl: './customer-detail-page.component.scss'
})
export class CustomerDetailPageComponent implements OnInit {
  customer?: Customer;

  constructor(private route: ActivatedRoute, private customerService: CustomerService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.customerService.get(id).subscribe(customer => this.customer = customer);
    }
  }

  creditUtilization(): number {
    if (!this.customer || !this.customer.creditLimit) {
      return 0;
    }
    return Math.min(100, (this.customer.creditUsed / this.customer.creditLimit) * 100);
  }
}



