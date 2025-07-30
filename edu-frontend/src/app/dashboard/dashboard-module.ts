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
import { ImageCropDialog } from './image-crop-dialog/image-crop-dialog';
import { SharedModule } from '../shared/shared-module';
import { MaterialModule } from '../shared/material.module';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ngx-image-cropper';

@NgModule({
  declarations: [
    AddMoney,
    BillTransfer,
    Customers,
    History,
    PaymentLink,
    InternalTransfer,
    BillPayments,
    CcPayments,
    ImageCropDialog
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    MaterialModule,
    FormsModule,
    ImageCropperModule
  ]
})
export class DashboardModule { }
