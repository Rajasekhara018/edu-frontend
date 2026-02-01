import { NgModule } from '@angular/core';
import { MaterialModule } from './material.module';
import { PageHeaderComponent } from './components/page-header.component';
import { FilterBarComponent } from './components/filter-bar.component';
import { DataTableComponent } from './components/data-table.component';
import { SummaryPanelComponent } from './components/summary-panel.component';
import { StatusPillComponent } from './components/status-pill.component';
import { SkeletonTableComponent } from './components/skeleton-table.component';

@NgModule({
  declarations: [
    PageHeaderComponent,
    FilterBarComponent,
    DataTableComponent,
    SummaryPanelComponent,
    StatusPillComponent,
    SkeletonTableComponent
  ],
  imports: [MaterialModule],
  exports: [
    MaterialModule,
    PageHeaderComponent,
    FilterBarComponent,
    DataTableComponent,
    SummaryPanelComponent,
    StatusPillComponent,
    SkeletonTableComponent
  ]
})
export class SharedModule {}
