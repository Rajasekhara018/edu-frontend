import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-invoice-failure',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './invoice-failure.component.html',
  styleUrl: './invoice-failure.component.scss'
})
export class InvoiceFailureComponent {
  failure = {
    attempt: 'INV-2026-0589',
    date: 'Feb 01, 2026',
    reason: 'Bank transfer rejected – account mismatch',
    support: 'finance@meddistributor.io'
  };

  recoveryOptions = [
    'Retry transfer with corrected bank details',
    'Switch to credit card payment via the ERP portal',
    'Open a support ticket (Finance Ops)'
  ];
}
