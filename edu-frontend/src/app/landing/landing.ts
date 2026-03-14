import { Component } from '@angular/core';

@Component({
  selector: 'app-landing',
  standalone: false,
  templateUrl: './landing.html',
  styleUrl: './landing.scss'
})
export class Landing {
  readonly quickStats = [
    { label: 'Opening balance', value: '₹2,663.53', tone: 'slate', delta: 'Healthy float ready' },
    { label: 'Credit processed', value: '₹1,019.50', tone: 'emerald', delta: 'Today so far' },
    { label: 'Debit settled', value: '₹1,010.00', tone: 'amber', delta: 'Live ledger sync' },
    { label: 'Closing estimate', value: '₹2,666.23', tone: 'indigo', delta: 'Projected end-of-day' },
  ];

  readonly services = [
    {
      title: 'Add Money',
      copy: 'Move funds into the operating wallet with a clean approval path and instant balance visibility.',
      route: '/dashboard/add-money',
      icon: 'bi bi-wallet2',
      accent: 'orange'
    },
    {
      title: 'Customers',
      copy: 'Create distributors, onboard agents, and review account states from the shared master table.',
      route: '/csearch/GET_CUSTOMERS',
      icon: 'bi bi-people',
      accent: 'blue'
    },
    {
      title: 'Commission Settings',
      copy: 'Maintain distributor defaults and agent-level commission rules with settlement visibility.',
      route: '/dashboard/commission-settings',
      icon: 'bi bi-percent',
      accent: 'indigo'
    },
    {
      title: 'History',
      copy: 'Track transactions, validate reconciliation, and inspect movement across today’s operations.',
      route: '/dashboard/history',
      icon: 'bi bi-clock-history',
      accent: 'green'
    },
    {
      title: 'Bill Payments',
      copy: 'Run utility and fee collections from one queue with clear status feedback and operator control.',
      route: '/dashboard/bill-payments',
      icon: 'bi bi-receipt',
      accent: 'plum'
    },
  ];

  readonly metrics = [
    { label: 'Successful volume', value: '₹109,385.06', description: 'High-confidence processed value' },
    { label: 'Failed transactions', value: '0', description: 'No unresolved failures reported' },
    { label: 'Operator readiness', value: '99.9%', description: 'Platform uptime target' },
  ];

  readonly workflow = [
    { step: '01', title: 'Fund the wallet', copy: 'Start with Add Money to ensure the operator balance is ready before collections begin.' },
    { step: '02', title: 'Set hierarchy and commissions', copy: 'Use Customers and Commission Settings to map agents under distributors and define payout rules.' },
    { step: '03', title: 'Execute collections', copy: 'Process bill payments with visibility into debit, credit, and final settlement.' },
    { step: '04', title: 'Review the ledger', copy: 'Close the loop through History and daily summaries for fast reconciliation and commission review.' },
  ];

  readonly announcements = [
    'MasterCard commission has been decreased. For Visa traffic, use PG 6 where required.',
    'Review today’s settlement mix before close to keep cash position aligned with debit outflow.',
  ];
}
