import { Component } from '@angular/core';

@Component({
  selector: 'app-add-money',
  standalone: false,
  templateUrl: './add-money.html',
  styleUrl: './add-money.scss'
})
export class AddMoney {
  readonly gatewayLimits = [
    { gateway: 'Yugma PG 6', amount: 'Rs. 2,00,000.00', status: 'Primary route' },
    { gateway: 'Yugma FEEZY 1', amount: 'Rs. 1,50,000.00', status: 'Secondary route' },
    { gateway: 'Yugma R', amount: 'Rs. 2,00,000.00', status: 'Fallback route' },
  ];

  readonly fundingPaths = [
    {
      title: 'Own account transfer',
      copy: 'Use linked CASA accounts for the cleanest and fastest wallet funding path.',
      note: 'Only for existing CASA users'
    },
    {
      title: 'Request from another wallet',
      copy: 'Initiate inter-user wallet funding when operator balance is managed centrally.',
      note: 'Useful for managed teams'
    },
    {
      title: 'External funding',
      copy: 'Use credit card, debit card, or external banking rails where aggregator coverage is available.',
      note: 'Based on aggregator support'
    }
  ];
}
