import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayEaseCommonTable } from './pay-ease-common-table/pay-ease-common-table';

const routes: Routes = [
    { path: 'csearch/:id', component: PayEaseCommonTable },
  { path: 'csearch', component: PayEaseCommonTable },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
