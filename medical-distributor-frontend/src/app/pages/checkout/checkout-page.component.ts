import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService, CartItem } from '../../core/services/cart.service';
import { CheckoutService, InvoiceResponse } from '../../core/services/checkout.service';
import { OrderService, SalesOrderResponse } from '../../core/services/order.service';

@Component({
  selector: 'app-checkout-page',
  standalone: false,
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.scss'
})
export class CheckoutPageComponent implements OnInit {
  orderId?: string | null;
  locked = false;
  order?: SalesOrderResponse;
  orderLoading = false;
  invoiceLoading = false;
  orderError = '';
  invoiceError = '';
  invoice?: InvoiceResponse;

  allocations = [
    { product: 'Paracetamol 500mg', batch: 'BCH-001', qty: 120, expiry: '2026-05-12' },
    { product: 'Cetirizine Syrup', batch: 'BCH-002', qty: 60, expiry: '2026-03-10' }
  ];

  summary = {
    subtotal: 28400,
    discount: 1200,
    tax: 1420,
    net: 28620
  };

  readonly stageFlow = [
    { key: 'draft', label: 'Draft' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'allocated', label: 'Allocated' },
    { key: 'packed', label: 'Packed' },
    { key: 'dispatched', label: 'Dispatched' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'invoiced', label: 'Invoiced' }
  ];

  private route = inject(ActivatedRoute);
  private orderService = inject(OrderService);
  private checkoutService = inject(CheckoutService);
  private cartService = inject(CartService);

  readonly cartItems$ = this.cartService.items$;
  readonly cartSummary$ = this.cartService.summary$;

  constructor() {}

  ngOnInit(): void {
    this.orderId = this.route.snapshot.paramMap.get('id');
    if (this.orderId) {
      this.fetchOrder(this.orderId);
    }
  }

  generateInvoice(): void {
    if (!this.orderId || this.invoiceLoading || this.locked) {
      return;
    }
    this.invoiceLoading = true;
    this.invoiceError = '';
    this.checkoutService.createInvoice(this.orderId).subscribe({
      next: invoice => {
        this.invoice = invoice;
        this.locked = true;
        this.summary = {
          subtotal: this.summary.subtotal,
          discount: this.summary.discount,
          tax: this.summary.tax,
          net: invoice.netTotal ?? this.summary.net
        };
      },
      error: () => {
        this.invoiceError = 'Unable to generate invoice. Please retry.';
      },
      complete: () => {
        this.invoiceLoading = false;
      }
    });
  }

  viewInvoicePdf(): void {
    if (!this.invoice?.id) {
      return;
    }
    this.checkoutService.getInvoicePdf(this.invoice.id).subscribe(blob => {
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank', 'noopener');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    });
  }

  private fetchOrder(orderId: string): void {
    this.orderLoading = true;
    this.orderError = '';
    this.orderService.get(orderId).subscribe({
      next: order => {
        this.order = order;
        this.summary = {
          subtotal: Number(order.subtotal ?? 0),
          discount: Number(order.discountTotal ?? 0),
          tax: Number(order.taxTotal ?? 0),
          net: Number(order.netTotal ?? 0)
        };
        const status = (order.status ?? '').toLowerCase();
        this.locked = status === 'invoiced' || status === 'closed';
      },
      error: () => {
        this.orderError = 'Unable to load order details.';
      },
      complete: () => {
        this.orderLoading = false;
      }
    });
  }

  get activeStageIndex(): number {
    const status = (this.order?.status ?? 'draft').toLowerCase();
    const index = this.stageFlow.findIndex(stage => stage.key === status);
    return index >= 0 ? index : 0;
  }

  isStageActive(index: number): boolean {
    return index <= this.activeStageIndex;
  }
}



