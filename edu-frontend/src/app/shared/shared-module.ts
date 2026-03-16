import { CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe, LowerCasePipe } from '@angular/common';
import { SharedRoutingModule } from './shared-routing-module';
import { PayEaseCommonTable } from './components/pay-ease-common-table/pay-ease-common-table';
import { MaterialModule } from './material.module';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { PayeaseIdleTimeoutDailog } from './payease-idle-timeout-dailog/payease-idle-timeout-dailog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Pagination } from './components/pagination/pagination';


@NgModule({
  declarations: [
    PayEaseCommonTable,
    PayeaseIdleTimeoutDailog,
    Pagination
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    HttpClientModule, // Ensure HttpClientModule is included
    ReactiveFormsModule,
    SharedRoutingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  exports: [
    PayEaseCommonTable,
    Pagination,
    PayeaseIdleTimeoutDailog
  ],
  providers: [
    DatePipe,
    LowerCasePipe,
    CurrencyPipe,
    DecimalPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-IN' }
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule
    };
  }
}
