import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-order-create-page',
  standalone: false,
  templateUrl: './order-create-page.component.html',
  styleUrl: './order-create-page.component.scss'
})
export class OrderCreatePageComponent {
  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);

  form = this.fb.group({
    customer: ['', Validators.required],
    lines: this.fb.array([this.createLine()])
  });
  creditRemaining = 185000;
  submitting = false;
  error = '';

  get lines(): FormArray {
    return this.form.get('lines') as FormArray;
  }

  addLine(): void {
    this.lines.push(this.createLine());
  }

  private createLine() {
    return this.fb.group({
      product: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      discount: [0, [Validators.min(0)]],
      taxRate: [5, [Validators.min(0)]]
    });
  }

  removeLine(index: number): void {
    this.lines.removeAt(index);
  }

  saveDraft(): void {
    this.error = '';
  }

  confirmOrder(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting = true;
    this.error = '';
    const payload = {
      customerId: this.form.value.customer ?? '',
      lines: this.lines.controls.map(ctrl => ({
        productId: ctrl.get('product')?.value ?? '',
        quantity: Number(ctrl.get('quantity')?.value ?? 0),
        unitPrice: Number(ctrl.get('unitPrice')?.value ?? 0),
        discount: Number(ctrl.get('discount')?.value ?? 0),
        taxRate: Number(ctrl.get('taxRate')?.value ?? 0)
      }))
    };
    this.orderService.create(payload).subscribe({
      next: () => {
        this.submitting = false;
      },
      error: () => {
        this.error = 'Unable to create order. Please review the details and retry.';
        this.submitting = false;
      }
    });
  }

  get subtotal(): number {
    return this.lines.controls.reduce((sum, ctrl) => {
      const qty = ctrl.get('quantity')?.value ?? 0;
      const price = ctrl.get('unitPrice')?.value ?? 0;
      return sum + qty * price;
    }, 0);
  }

  get discountTotal(): number {
    return this.lines.controls.reduce((sum, ctrl) => sum + (ctrl.get('discount')?.value ?? 0), 0);
  }

  get taxTotal(): number {
    return this.lines.controls.reduce((sum, ctrl) => {
      const qty = ctrl.get('quantity')?.value ?? 0;
      const price = ctrl.get('unitPrice')?.value ?? 0;
      const discount = ctrl.get('discount')?.value ?? 0;
      const taxRate = ctrl.get('taxRate')?.value ?? 0;
      const base = qty * price - discount;
      return sum + (base * taxRate) / 100;
    }, 0);
  }

  get netTotal(): number {
    return this.subtotal - this.discountTotal + this.taxTotal;
  }
}



