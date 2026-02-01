import { Component, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-payment-allocation-dialog',
  standalone: false,
  templateUrl: './payment-allocation-dialog.component.html',
  styleUrl: './payment-allocation-dialog.component.scss'
})
export class PaymentAllocationDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PaymentAllocationDialogComponent>);

  form = this.fb.group({
    invoiceNo: ['', Validators.required],
    amount: [0, [Validators.required, Validators.min(1)]],
    method: ['Bank', Validators.required]
  });

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.dialogRef.close(this.form.value);
  }
}



