import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as sha512 from 'js-sha512';
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

  constructor(private router: Router,public datepipe: DatePipe,) { }

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
  makepayment(proceessReq: proceessReq) {
    const currentDate = new Date();
    proceessReq.orderId = proceessReq.terminalNo + this.datepipe.transform(currentDate, 'ddMMyyyyHHmmss');

    const mapForm = document.createElement('form');
    mapForm.method = 'POST';
    mapForm.action = proceessReq.checkoutUrl + '/api/auth/getpaymentsession';

    const mapInputT = document.createElement('input');
    mapInputT.type = 'hidden';
    mapInputT.name = 't';
    mapInputT.setAttribute('value', proceessReq.terminalNo);
    mapForm.appendChild(mapInputT);

    const mapInputO = document.createElement('input');
    mapInputO.type = 'hidden';
    mapInputO.name = 'o';
    mapInputO.setAttribute('value', proceessReq.orderId);
    mapForm.appendChild(mapInputO);

    const mapInputTa = document.createElement('input');
    mapInputTa.type = 'hidden';
    mapInputTa.name = 'ta';
    mapInputTa.setAttribute('value', proceessReq.amount.toString());
    mapForm.appendChild(mapInputTa);

    const mapInputC = document.createElement('input');
    mapInputC.type = 'hidden';
    mapInputC.name = 'c';
    mapInputC.setAttribute('value', "INR");
    mapForm.appendChild(mapInputC);

    const mapInputMac = document.createElement('input');
    mapInputMac.type = 'hidden';
    mapInputMac.name = 'mac';
    mapInputMac.setAttribute('value', proceessReq.token);
    mapForm.appendChild(mapInputMac);

    const mapInputMurl = document.createElement('input');
    mapInputMurl.type = 'hidden';
    mapInputMurl.name = 'murl';
    mapInputMurl.setAttribute('value', window.location.href.split('/#/')[0]);
    mapForm.appendChild(mapInputMurl);

    const mapInputName = document.createElement('input');
    mapInputName.type = 'hidden';
    mapInputName.name = 'name';
    mapInputName.setAttribute('value', proceessReq.customerName);
    mapForm.appendChild(mapInputName);

    const mapInputMobileNo = document.createElement('input');
    mapInputMobileNo.type = 'hidden';
    mapInputMobileNo.name = 'phone';
    mapInputMobileNo.setAttribute('value', proceessReq.customerMobileNo);
    mapForm.appendChild(mapInputMobileNo);

    const mapInputEmailId = document.createElement('input');
    mapInputEmailId.type = 'hidden';
    mapInputEmailId.name = 'emailId';
    mapInputEmailId.setAttribute('value', proceessReq.customerEmailId);
    mapForm.appendChild(mapInputEmailId);

    const mapInputha = document.createElement('input');
    mapInputha.type = 'hidden';
    mapInputha.name = 'ha';
    mapInputha.setAttribute('value', sha512.sha512(proceessReq.amount.toString()));
    mapForm.appendChild(mapInputha);
    // const mapInputpc = document.createElement('input');
    // mapInputpc.type = 'hidden';
    // mapInputpc.name = 'pc';
    // mapInputpc.setAttribute('value', this.paymentData.pin);
    // mapForm.appendChild(mapInputpc);
    const mapInputsa = document.createElement('input');
    mapInputsa.type = 'hidden';
    mapInputsa.name = 'sc';
    mapInputsa.setAttribute('value', "INR");
    mapForm.appendChild(mapInputsa);
    document.body.appendChild(mapForm);
    mapForm.submit();
  }
}

export class proceessReq {
  checkoutUrl!: string;
  terminalNo!: string;
  amount!: any;
  token!: string;
  customerName!: string;
  customerMobileNo!: string;
  customerEmailId!: string;
  orderId!: string;
}
