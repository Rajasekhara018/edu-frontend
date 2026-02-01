import { Component } from '@angular/core';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Customers', icon: 'groups', route: '/customers' },
    { label: 'Products', icon: 'medication', route: '/products' },
    { label: 'Inventory', icon: 'inventory_2', route: '/inventory' },
    { label: 'Orders', icon: 'post_add', route: '/orders/new' },
    { label: 'Checkout', icon: 'receipt_long', route: '/checkout' },
    { label: 'Payments', icon: 'payments', route: '/payments' },
    { label: 'Returns', icon: 'assignment_return', route: '/returns' },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' }
  ];
}



