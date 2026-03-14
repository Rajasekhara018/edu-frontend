import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-make-payment',
  standalone: false,
  templateUrl: './make-payment.html',
  styleUrl: './make-payment.scss'
})
export class MakePayment {
  form = {
    name: '',
    phone: '',
    email: '',
    amount: ''
  };

  readonly paymentChannels = [
    { label: 'Instant bank debit', note: 'Best for direct account-backed collections.' },
    { label: 'Card payment', note: 'Use for customers paying by debit or credit card.' },
    { label: 'Assisted checkout', note: 'Operator-led flow for phone-assisted payment capture.' }
  ];

  readonly checkpoints = [
    'Confirm payer identity before initiating the payment request.',
    'Keep email and phone number accurate for receipt delivery and follow-up.',
    'Review the amount once before submitting to reduce failed retries.'
  ];

  constructor(private router: Router) {}

  openInvoice(status: 'success' | 'failure') {
    const timestamp = new Date();
    const gateway = status === 'success' ? 'Yugma PG 6' : 'Yugma PG 6';
    const orderId = `ORD-${timestamp.getFullYear()}${String(timestamp.getMonth() + 1).padStart(2, '0')}${String(timestamp.getDate()).padStart(2, '0')}-${timestamp.getHours()}${timestamp.getMinutes()}${timestamp.getSeconds()}`;
    const paymentId = `PAY-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    const processorRef = `PGREF${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    this.router.navigate([`/dashboard/payment-invoice/${status}`], {
      queryParams: {
        name: this.form.name || 'Aarav Sharma',
        phone: this.form.phone || '+91 98765 43210',
        email: this.form.email || 'aarav.sharma@example.com',
        amount: this.form.amount || '2,450.00',
        mode: 'Instant collection',
        orderId,
        paymentId,
        processorRef,
        gateway,
        paidAt: timestamp.toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }) + ' IST',
        reason: 'The issuing bank declined the transaction because the payer authentication check was not completed.'
      }
    });
  }
}
