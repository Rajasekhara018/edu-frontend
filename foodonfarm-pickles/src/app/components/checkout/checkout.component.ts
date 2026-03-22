import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { CartService } from '../../Services/cart.service';
import { CustomerDetails, OrderService } from '../../Services/order.service';
import { ImageFallbackUtil } from '../../Services/image-fallback.util';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  readonly cartItems$ = this.cartService.cartItems$;
  readonly summary$ = this.cartItems$.pipe(map(items => this.cartService.getSummary(items)));

  customer: CustomerDetails = {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  };

  email = '';
  saveAs: 'Home' | 'Work' = 'Home';
  sameAsShipping = true;
  showBillingAddressForm = false;
  shippingMethod = 'standard';
  paymentMethod = 'UPI';
  isSubmitting = false;
  mobileOptIn = false;
  billingCustomer: CustomerDetails = {
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: ''
  };
  readonly shippingOptions = [
    { id: 'standard', title: 'Standard Shipping', eta: 'Delivery in 5-7 days', charge: 69 },
    { id: 'priority', title: 'Priority Shipping', eta: 'Delivery in 2-3 days', charge: 129 }
  ];

  constructor(
    private readonly cartService: CartService,
    private readonly orderService: OrderService,
    private readonly router: Router
  ) {}

  closeCheckout(): void {
    this.cartService.closeCheckout();
  }

  toggleBillingAddressForm(): void {
    this.showBillingAddressForm = !this.showBillingAddressForm;
    this.sameAsShipping = !this.showBillingAddressForm;
    if (this.sameAsShipping) {
      this.syncBillingWithShipping();
    }
  }

  onSameAsShippingChange(): void {
    this.showBillingAddressForm = !this.sameAsShipping;
    if (this.sameAsShipping) {
      this.syncBillingWithShipping();
    }
  }

  placeOrder(): void {
    const items = this.cartService.getItemsSnapshot();
    const summary = this.cartService.getSummary(items);
    if (!this.canPlaceOrder(items) || !this.isValidEmail(this.email)) {
      return;
    }

    this.isSubmitting = true;
    const shipping = this.getShippingCharge(summary.subtotal);
    const finalSummary = {
      ...summary,
      shipping,
      total: summary.subtotal + summary.tax + shipping
    };
    const billingAddress = this.sameAsShipping
      ? { ...this.customer }
      : { ...this.billingCustomer };

    const order = this.orderService.placeOrder({
      items,
      customer: { ...this.customer },
      billingAddress,
      paymentMethod: this.paymentMethod,
      summary: finalSummary
    });

    this.cartService.clearCart();
    this.cartService.closeDrawer();
    this.cartService.closeCheckout();
    this.router.navigate(['/order-success', order.id]);
  }

  canPlaceOrder(items: { length: number }): boolean {
    if (this.isSubmitting || !items.length) {
      return false;
    }

    return Boolean(
      this.customer.fullName.trim() &&
      this.customer.address.trim() &&
      this.email.trim() &&
      (this.sameAsShipping || (this.billingCustomer.fullName.trim() && this.billingCustomer.address.trim()))
    );
  }

  getShippingCharge(subtotal: number): number {
    if (subtotal >= 1500) {
      return 0;
    }

    return 69;
  }

  getGrandTotal(subtotal: number, tax: number): number {
    return subtotal + tax + this.getShippingCharge(subtotal);
  }

  private syncBillingWithShipping(): void {
    this.billingCustomer = {
      fullName: this.customer.fullName,
      phone: this.customer.phone,
      address: this.customer.address,
      city: this.customer.city,
      pincode: this.customer.pincode
    };
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  getSafeImage(url: string | undefined, label: string, context: string): string {
    return ImageFallbackUtil.ensureImage(url, label, context);
  }

  onImageError(event: Event, label: string, context: string): void {
    ImageFallbackUtil.handleImageError(event, label, context);
  }
}
