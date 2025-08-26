import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-history',
  standalone: false,
  templateUrl: './history.html',
  styleUrl: './history.scss'
})
export class History implements OnInit {
  transactions: Transaction[] = [];

  ngOnInit() {
    this.generateRandomTransactions(5); // generate 10 rows
  }

  generateRandomTransactions(count: number) {
    const modes = ['IMPS', 'NEFT', 'RTGS'];
    const statuses = ['SUCCESS', 'FAILED', 'PENDING'];

    for (let i = 1; i <= count; i++) {
      const mode = modes[Math.floor(Math.random() * modes.length)];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const amount = +(Math.random() * 5000 + 500).toFixed(2);
      const charge = +(amount * 0.015).toFixed(2);
      const transferAmount = +(amount - charge).toFixed(2);

      this.transactions.push({
        srNo: i,
        paymentDate: new Date().toLocaleString(),
        urn: `URN${Math.floor(Math.random() * 100000)}`,
        name: `User ${i}`,
        mobile: `9${Math.floor(100000000 + Math.random() * 899999999)}`,
        paymentId: `${Math.floor(Math.random() * 9999999999)}`,
        accountDetails: `Card#${Math.floor(1000 + Math.random() * 8999)}`,
        mode: mode as 'IMPS' | 'NEFT' | 'RTGS',
        amount,
        charge,
        transferAmount,
        status: status as 'SUCCESS' | 'FAILED' | 'PENDING'
      });
    }
  }

  // summary
  get totalCount() {
    return this.transactions.length;
  }
  get totalAmount() {
    return this.transactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2);
  }
  get successStats() {
    const successTx = this.transactions.filter(t => t.status === 'SUCCESS');
    return { count: successTx.length, amount: successTx.reduce((s, t) => s + t.amount, 0).toFixed(2) };
  }
  get failedStats() {
    const failedTx = this.transactions.filter(t => t.status === 'FAILED');
    return { count: failedTx.length, amount: failedTx.reduce((s, t) => s + t.amount, 0).toFixed(2) };
  }
  get pendingStats() {
    const pendingTx = this.transactions.filter(t => t.status === 'PENDING');
    return { count: pendingTx.length, amount: pendingTx.reduce((s, t) => s + t.amount, 0).toFixed(2) };
  }
}
export interface Transaction {
  srNo: number;
  paymentDate: string;
  urn: string;
  name: string;
  mobile: string;
  paymentId: string;
  accountDetails: string;
  mode: 'IMPS' | 'NEFT' | 'RTGS';
  amount: number;
  charge: number;
  transferAmount: number;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
}
