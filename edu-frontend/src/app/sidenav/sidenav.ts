import { Component, HostListener, ViewChild } from '@angular/core';
import { PayeaseRestservice } from '../shared/services/payease-restservice';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { PayeaseSideMenuService } from './side-menu.service';
import { MatSidenav } from '@angular/material/sidenav';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.html',
  styleUrl: './sidenav.scss'
})
export class Sidenav {
  constructor(public postService: PayeaseRestservice, public authService: AuthService,
    private router: Router,
    public sideMenuService: PayeaseSideMenuService,
  ) {
  }
  @ViewChild('sideMenu', { static: true }) private sideMenu!: MatSelectionList;
  sidenav!: MatSidenav;
  isMobile = true;
  userRole: string[] = [];
  filteredNavItems: NavItem[] = [];
  ngOnInit() {
    this.checkScreenSize();
    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('email');
    if (storedName) {
      this.userName = storedName;
    } else if (storedEmail) {
      let lu: any = storedEmail;
      lu = lu.split('@');
      lu = lu[0].replace('.', ' ');
      this.userName = lu;
    }

    const rolesRaw = localStorage.getItem('LoggedInUserroles');
    if (rolesRaw && rolesRaw !== 'undefined') {
      try {
        const parsed = JSON.parse(rolesRaw);
        this.userRole = Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        this.userRole = [rolesRaw];
      }
    } else {
      this.userRole = [];
    }

    this.filterNavItems();
  }
  filterNavItems(): void {
    const normalizedRoles = this.userRole.map((role) => role?.toUpperCase?.() || '');
    this.filteredNavItems = this.navItems.filter((item) => {
      if (!item.rolesAllowed?.length) {
        return true;
      }

      return item.rolesAllowed.some((allowedRole) =>
        normalizedRoles.some((role) => role.includes(allowedRole))
      );
    });
  }
  @HostListener('window:resize', [])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768; // Bootstrap sm breakpoint
    if (this.isMobile) {
      this.isCollapsed = true;
      this.postService.isCollapsed = true;
    } else {
      this.isCollapsed = false;
      this.postService.isCollapsed = false;
    }
  }

  toggleMenu() {
    if (this.isMobile) {
      this.sidenav.toggle();
      this.postService.isCollapsed = false; // On mobile, the menu can never be collapsed
    } else {
      this.sidenav.open(); // On desktop/tablet, the menu can never be fully closed
      this.postService.isCollapsed = !this.postService.isCollapsed;
    }
  }
  step!: number;
  userName!: string;
  designation!: string;
  isActive = false;
  hover = false;

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/']);
  }
  isCollapsed = false;
  navItems: NavItem[] = [
    // { label: 'Dashboard', route: '/home', icon: 'home', iconType: 'lucide', tooltip: 'Dashboard' },
    // { label: 'Documents', route: 'csearch/GET_DOCUMENTS', icon: 'file-text', iconType: 'lucide', tooltip: 'Documents' },
    // { label: 'Approvals', route: 'csearch/GET_APPROVAL_QUEUE', icon: 'check-circle', iconType: 'lucide', tooltip: 'Approvals' },
    // { label: 'Audit Log', route: 'csearch/GET_AUDIT_LOGS', icon: 'check-circle', iconType: 'lucide', tooltip: 'Audit Log' },
    // { label: 'Categories', route: '/categories', icon: 'folder-open', iconType: 'lucide', tooltip: 'Categories' },
    // { label: 'Users', route: '/users', icon: 'users', iconType: 'lucide', tooltip: 'Users', rolesAllowed: ['SUPER_ADMIN', 'HOD'] },
    // { label: 'Analytics', route: '/analytics', icon: 'bar-chart-3', iconType: 'lucide', tooltip: 'Analytics' },
    // { label: 'Settings', route: '/settings', icon: 'settings', iconType: 'lucide', tooltip: 'Settings' }
    { label: 'Dashboard', route: '/home', icon: 'home', iconType: 'lucide', tooltip: 'Dashboard' },
    { label: 'Add Money', route: '/dashboard/add-money', icon: 'file-text', iconType: 'lucide', tooltip: 'Add Money' },
    { label: 'Make Payment', route: '/dashboard/make-payment', icon: 'credit-card', iconType: 'lucide', tooltip: 'Make Payment' },
    { label: 'Commission Dashboard', route: '/dashboard/commission-dashboard', icon: 'bar-chart-3', iconType: 'lucide', tooltip: 'Commission Dashboard', rolesAllowed: ['ADMIN', 'DISTRIBUTOR', 'AGENT'] },
    { label: 'Commission Settings', route: '/dashboard/commission-settings', icon: 'bi-cash-coin', iconType: 'bootstrap', tooltip: 'Commission Settings', rolesAllowed: ['ADMIN', 'DISTRIBUTOR'] },
    // { label: 'Bill Transafer', route: '/dashboard/bill-transfer', icon: 'check-circle', iconType: 'lucide', tooltip: 'Bill Transafer' },
    { label: 'History', route: '/dashboard/history', icon: 'folder-open', iconType: 'lucide', tooltip: 'History' },
    { label: 'Customer', route: '/csearch/GET_CUSTOMERS', icon: 'users', iconType: 'lucide', tooltip: 'Customers', rolesAllowed: ['ADMIN', 'DISTRIBUTOR'] },
    { label: 'Bill Payments', route: '/dashboard/bill-payments', icon: 'check-circle', iconType: 'lucide', tooltip: 'Bill Payments' },
    // { label: 'Internal Transfer', route: '/dashboard/internal-transfer', icon: 'bar-chart-3', iconType: 'lucide', tooltip: 'Internal Transfer' },
    // { label: 'Payment Link', route: '/dashboard/payment-link', icon: 'settings', iconType: 'lucide', tooltip: 'Payment Link' }
  ];
  shouldShowItem(item: NavItem): boolean {
    return !item.privilegeId || this.postService.getPriv(item.privilegeId);
  }
  ngAfterViewInit() {
    // lucide.createIcons();
  }
  toggleSidebar() {
    // this.isCollapsed = !this.isCollapsed;
    this.postService.isCollapsed = !this.postService.isCollapsed;
  }
  storeSelectedMenu(item: any) {
    localStorage.setItem('navMenu', item.label);
    // this.postService.navMenu = item.label;
    this.postService.setNavMenu(item.label);
  }
  backgroundImageUrl: string = '';
}

export interface NavItem {
  label: string;
  icon: string;
  iconType: 'lucide' | 'bootstrap';
  route: string;
  tooltip: string;
  privilegeId?: number;
  rolesAllowed?: string[];
}

