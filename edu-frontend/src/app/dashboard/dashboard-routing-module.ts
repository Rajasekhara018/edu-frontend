import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMoney } from './add-money/add-money';
import { PaymentLink } from './payment-link/payment-link';
import { InternalTransfer } from './internal-transfer/internal-transfer';
import { History } from './history/history';
import { Customers } from './customers/customers';
import { CcPayments } from './cc-payments/cc-payments';
import { BillTransfer } from './bill-transfer/bill-transfer';
import { BillPayments } from './bill-payments/bill-payments';

const routes: Routes = [
  { path: 'add-money', component: AddMoney },
  { path: 'bill-payments', component: BillPayments },
  { path: 'bill-transfer', component: BillTransfer },
  { path: 'cc-payments', component: CcPayments },
  { path: 'customers', component: Customers },
  { path: 'history', component: History },
  { path: 'internal-transfer', component: InternalTransfer },
  { path: 'payment-link', component: PaymentLink },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
