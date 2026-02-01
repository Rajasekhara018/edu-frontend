import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged } from 'rxjs';
import { CartService } from '../core/services/cart.service';
import { CatalogSearchService } from '../core/services/catalog-search.service';
import { PharmaProductsService } from '../core/services/pharma-products.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-public-topbar',
  standalone: false,
  templateUrl: './public-topbar.component.html',
  styleUrl: './public-topbar.component.scss'
})
export class PublicTopbarComponent implements OnInit {
  private cartService = inject(CartService);
  private catalogSearch = inject(CatalogSearchService);
  private pharmaProducts = inject(PharmaProductsService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  search = '';
  summary$ = this.cartService.summary$;
  categories: string[] = [];
  features = [
    'FEFO-ready selection',
    'GST invoices',
    'Cold-chain tracking',
    '24h dispatch SLA'
  ];

  isDark = false;

  ngOnInit(): void {
    this.catalogSearch.search$
      .pipe(distinctUntilChanged(), takeUntilDestroyed(this.destroyRef))
      .subscribe(term => {
        this.search = term;
      });

    this.pharmaProducts.getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(categories => {
        this.categories = categories.slice(0, 6);
      });
  }

  onSearchChange(value: string): void {
    this.catalogSearch.setSearch(value);
  }

  goToCheckout(): void {
    this.router.navigate(['/shop/checkout']);
  }

  goToProfile(target: string): void {
    this.router.navigate(['/shop']).then(() => {
      const element = document.getElementById(target);
      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  openOrders(): void {
    this.router.navigate(['/shop']).then(() => this.goToProfile('profile'));
  }

  openReturns(): void {
    this.router.navigate(['/shop']).then(() => this.goToProfile('support'));
  }

  openSettings(): void {
    this.router.navigate(['/shop']);
  }

  toggleTheme(state?: boolean): void {
    this.isDark = state !== undefined ? state : !this.isDark;
    document.body.classList.toggle('dark-theme', this.isDark);
  }
}
