import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../Services/cart.service';
import { SalesConfigService } from '../../Services/sales-config.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  isMobileMenuOpen = false;
  cartCount$ = this.cartService.cartCount$;

  constructor(
    private cartService: CartService,
    private router: Router,
    public readonly salesConfig: SalesConfigService
  ) {}

  toggleMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMenu() {
    this.isMobileMenuOpen = false;
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
    this.closeMenu();
  }
}
