import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing-module';
import { AddMoney } from './add-money/add-money';
import { BillTransfer } from './bill-transfer/bill-transfer';
import { Customers } from './customers/customers';
import { History } from './history/history';
import { PaymentLink } from './payment-link/payment-link';
import { InternalTransfer } from './internal-transfer/internal-transfer';
import { BillPayments } from './bill-payments/bill-payments';
import { CcPayments } from './cc-payments/cc-payments';


@NgModule({
  declarations: [
    AddMoney,
    BillTransfer,
    Customers,
    History,
    PaymentLink,
    InternalTransfer,
    BillPayments,
    CcPayments
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
