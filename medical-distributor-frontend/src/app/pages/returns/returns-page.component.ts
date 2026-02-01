import { Component, inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-returns-page',
  standalone: false,
  templateUrl: './returns-page.component.html',
  styleUrl: './returns-page.component.scss'
})
export class ReturnsPageComponent {
  private fb = inject(FormBuilder);

  form = this.fb.group({
    invoiceNo: ['', Validators.required],
    reason: ['', Validators.required],
    lines: this.fb.array([
      this.createLine('Paracetamol 500mg', 'BCH-001', 120, true),
      this.createLine('Cetirizine Syrup', 'BCH-002', 60, false)
    ])
  });

  get lines(): FormArray {
    return this.form.get('lines') as FormArray;
  }

  addLine(product: string, batch: string, invoiced: number): void {
    this.lines.push(this.createLine(product, batch, invoiced, true));
  }

  private createLine(product: string, batch: string, invoiced: number, saleable: boolean) {
    return this.fb.group({
      product: [product],
      batch: [batch],
      invoiced: [invoiced],
      returnQty: [0, [Validators.min(0)]],
      saleable: [saleable]
    });
  }
}



