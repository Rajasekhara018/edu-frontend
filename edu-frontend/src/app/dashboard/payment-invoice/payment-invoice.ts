import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-payment-invoice',
  standalone: false,
  templateUrl: './payment-invoice.html',
  styleUrl: './payment-invoice.scss'
})
export class PaymentInvoice {
  status: 'success' | 'failure' = 'success';

  invoice = {
    title: 'Payment successful',
    headline: 'Payment completed and acknowledged by the processor.',
    note: 'The receipt is ready to be shared with the payer and logged for reconciliation.',
    badge: 'Success',
    amount: '2,450.00',
    customerName: 'Aarav Sharma',
    email: 'aarav.sharma@example.com',
    phone: '+91 98765 43210',
    orderId: 'ORD-240314-1182',
    paymentId: 'PAY-8932457821',
    processorRef: 'PGREF8932457821',
    gateway: 'Yugma PG 6',
    paidAt: '14 Mar 2026, 16:48 IST',
    paymentMode: 'Card payment',
    statusText: 'Successful',
    statusDetail: 'The acquiring bank accepted the payment and the collection is complete.',
    failureReason: '',
    nextStepTitle: 'Next actions',
    nextSteps: [
      'Share the payment acknowledgement with the payer over email or SMS.',
      'Verify the processor reference before end-of-day reconciliation.',
      'Use History to review the transaction in the settlement queue.'
    ]
  };

  readonly timeline = [
    { label: 'Request created', time: '16:47:12', detail: 'Operator submitted the payment request.' },
    { label: 'Processor accepted', time: '16:47:18', detail: 'Gateway tokenized and forwarded the request.' },
    { label: 'Bank response received', time: '16:48:02', detail: 'Final response captured from the payment processor.' }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const status = params.get('status');
      this.status = status === 'failure' ? 'failure' : 'success';
      this.applyQueryData();
    });
  }

  get isSuccess() {
    return this.status === 'success';
  }

  private applyQueryData() {
    const query = this.route.snapshot.queryParamMap;
    const amount = query.get('amount');
    const name = query.get('name');
    const email = query.get('email');
    const phone = query.get('phone');
    const mode = query.get('mode');
    const orderId = query.get('orderId');
    const paymentId = query.get('paymentId');
    const processorRef = query.get('processorRef');
    const gateway = query.get('gateway');
    const paidAt = query.get('paidAt');
    const failureReason = query.get('reason');

    this.invoice = {
      ...this.invoice,
      amount: amount || this.invoice.amount,
      customerName: name || this.invoice.customerName,
      email: email || this.invoice.email,
      phone: phone || this.invoice.phone,
      paymentMode: mode || this.invoice.paymentMode,
      orderId: orderId || this.invoice.orderId,
      paymentId: paymentId || this.invoice.paymentId,
      processorRef: processorRef || this.invoice.processorRef,
      gateway: gateway || this.invoice.gateway,
      paidAt: paidAt || this.invoice.paidAt
    };

    if (this.isSuccess) {
      this.invoice = {
        ...this.invoice,
        title: 'Payment successful',
        headline: 'Payment completed and acknowledged by the processor.',
        note: 'The receipt is ready to be shared with the payer and logged for reconciliation.',
        badge: 'Success',
        statusText: 'Successful',
        statusDetail: 'The acquiring bank accepted the payment and the collection is complete.',
        failureReason: '',
        nextStepTitle: 'Next actions',
        nextSteps: [
          'Share the payment acknowledgement with the payer over email or SMS.',
          'Verify the processor reference before end-of-day reconciliation.',
          'Use History to review the transaction in the settlement queue.'
        ]
      };
      return;
    }

    this.invoice = {
      ...this.invoice,
      title: 'Payment failed',
      headline: 'The processor returned a failure response for this payment attempt.',
      note: 'Review the failure reason, confirm customer details, and retry only after correcting the issue.',
      badge: 'Failure',
      statusText: 'Failed',
      statusDetail: 'The processor rejected the payment before final authorization.',
      failureReason: failureReason || 'Bank declined the transaction because the account verification step did not match.',
      nextStepTitle: 'Recovery steps',
      nextSteps: [
        'Confirm the payer mobile number, email, and amount before retrying.',
        'Ask the customer to verify bank or card details if the failure persists.',
        'Log the failed attempt in History and retry using a different collection route if needed.'
      ]
    };
  }
}
