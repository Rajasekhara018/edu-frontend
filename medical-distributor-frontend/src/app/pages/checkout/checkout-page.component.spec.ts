import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { SharedModule } from '../../shared/shared.module';
import { ActivatedRoute } from '@angular/router';
import { CheckoutPageComponent } from './checkout-page.component';
import { OrderService } from '../../core/services/order.service';
import { CheckoutService } from '../../core/services/checkout.service';

class MockActivatedRoute {
  snapshot = { paramMap: new Map([['id', 'test-id']]) } as any;
}

class OrderServiceStub {
  get() {
    return of({
      id: 'test-id',
      orderNo: 'SO-2026-001',
      customerName: 'Apex Health',
      status: 'Allocated',
      allocationStatus: 'Allocated',
      orderDate: '2026-02-01',
      subtotal: 1000,
      discountTotal: 0,
      taxTotal: 50,
      netTotal: 1050
    });
  }
}

class CheckoutServiceStub {
  createInvoice() {
    return of({ id: 'inv-1', invoiceNo: 'INV-001', status: 'INVOICED', netTotal: 1050 });
  }
  getInvoicePdf() {
    return of(new Blob());
  }
}

describe('CheckoutPageComponent', () => {
  let component: CheckoutPageComponent;
  let fixture: ComponentFixture<CheckoutPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckoutPageComponent],
      imports: [RouterTestingModule, SharedModule],
      providers: [
        { provide: ActivatedRoute, useClass: MockActivatedRoute },
        { provide: OrderService, useClass: OrderServiceStub },
        { provide: CheckoutService, useClass: CheckoutServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CheckoutPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('locks after invoice generation', () => {
    expect(component.locked).toBe(false);
    component.generateInvoice();
    expect(component.locked).toBe(true);
  });
});
