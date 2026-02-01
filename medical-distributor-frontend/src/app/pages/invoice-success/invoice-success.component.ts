import { Component } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-invoice-success',
  standalone: true,
  imports: [CommonModule, DecimalPipe],
  templateUrl: './invoice-success.component.html',
  styleUrl: './invoice-success.component.scss'
})
export class InvoiceSuccessComponent {
  invoiceMeta = {
    number: 'INV-2026-0587',
    date: 'Feb 01, 2026',
    dueDate: 'Feb 10, 2026',
    customer: 'Balanced Health Partners',
    po: 'PO-8811',
    reference: 'Prime Pharma Network'
  };

  lineItems = [
    { sku: 'RX-2032', description: 'Cold-chain-ready insulin packs', qty: 120, price: 820 },
    { sku: 'OTC-1409', description: 'Clinic starter bundle', qty: 30, price: 420 },
    { sku: 'SUP-1144', description: 'Sterile disposables kit (16 pcs)', qty: 50, price: 285 }
  ];

  get subtotal(): number {
    return this.lineItems.reduce((sum, entry) => sum + entry.qty * entry.price, 0);
  }

  taxes = 0.18;

  get taxAmount(): number {
    return this.subtotal * this.taxes;
  }

  get total(): number {
    return this.subtotal + this.taxAmount;
  }
}
