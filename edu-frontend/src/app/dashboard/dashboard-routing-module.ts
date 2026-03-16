import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddMoney } from './add-money/add-money';
import { PaymentLink } from './payment-link/payment-link';
import { InternalTransfer } from './internal-transfer/internal-transfer';
import { History } from './history/history';
import { CcPayments } from './cc-payments/cc-payments';
import { BillTransfer } from './bill-transfer/bill-transfer';
import { BillPayments } from './bill-payments/bill-payments';
import { TransactionStatus } from './transaction-status/transaction-status';
import { TransactionHistory } from './transaction-history/transaction-history';
import { RaiseCompliant } from './raise-compliant/raise-compliant';
import { ComplaintStatus } from './complaint-status/complaint-status';
import { MakePayment } from './make-payment/make-payment';
import { PaymentInvoice } from './payment-invoice/payment-invoice';
import { CommissionSettings } from './commission-settings/commission-settings';
import { CommissionDashboard } from './commission-dashboard/commission-dashboard';
import { authGuard } from '../auth/auth.guard';
import { Users } from './users/users';

const routes: Routes = [
  { path: 'add-money', component: AddMoney, canActivate: [authGuard] },
  { path: 'bill-payments', component: BillPayments, canActivate: [authGuard] },
  { path: 'bill-transfer', component: BillTransfer, canActivate: [authGuard] },
  { path: 'cc-payments', component: CcPayments, canActivate: [authGuard] },
  { path: 'user', component: Users, canActivate: [authGuard] },
  { path: 'user/cre', component: Users, canActivate: [authGuard] },
  { path: 'user/:id', component: Users, canActivate: [authGuard] },
  { path: 'history', component: History, canActivate: [authGuard] },
  { path: 'internal-transfer', component: InternalTransfer, canActivate: [authGuard] },
  { path: 'make-payment', component: MakePayment, canActivate: [authGuard] },
  { path: 'commission-dashboard', component: CommissionDashboard, canActivate: [authGuard] },
  { path: 'commission-settings', component: CommissionSettings, canActivate: [authGuard] },
  { path: 'payment-invoice/:status', component: PaymentInvoice, canActivate: [authGuard] },
  { path: 'payment-link', component: PaymentLink, canActivate: [authGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
