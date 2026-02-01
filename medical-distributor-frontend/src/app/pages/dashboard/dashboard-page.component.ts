import { Component } from '@angular/core';
import { DataColumn } from '../../shared/components/data-table.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: false,
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss'
})
export class DashboardPageComponent {
  kpis = [
    { label: 'Today Orders', value: 42 },
    { label: 'Pending Checkout', value: 13 },
    { label: 'Near Expiry (<60d)', value: 9 },
    { label: 'Outstanding (INR)', value: 'INR 18.4L' }
  ];

  alerts = [
    { type: 'Credit Limit', message: 'Apex Health exceeded credit limit by INR 48,000.' },
    { type: 'Expiry', message: 'Batch BCH-002 (Cetirizine) expires in 45 days.' },
    { type: 'Dispatch', message: 'SO-2026-014 dispatch delayed by 2 days.' }
  ];

  pendingTable = [
    { orderNo: 'SO-2026-014', customer: 'Apex Health', status: 'Allocated', value: 84250 },
    { orderNo: 'SO-2026-015', customer: 'CarePlus Medicals', status: 'Packed', value: 51890 },
    { orderNo: 'SO-2026-016', customer: 'Wellness Hub', status: 'Confirmed', value: 24400 }
  ];

  pendingColumns: DataColumn[] = [
    { key: 'orderNo', label: 'Order' },
    { key: 'customer', label: 'Customer' },
    { key: 'status', label: 'Status', type: 'status' },
    { key: 'value', label: 'Value', type: 'currency' }
  ];
}



