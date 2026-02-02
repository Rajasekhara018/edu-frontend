import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ToastService } from '../shared/toast.service';
import { Role } from '../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  readonly roles: Role[] = ['CUSTOMER', 'DRIVER', 'ADMIN'];
  readonly form = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    role: ['CUSTOMER', Validators.required],
    email: [''],
    vehicleType: [''],
    vehicleNumber: ['']
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly toast: ToastService
  ) {}

  get isDriver() {
    return this.form.controls.role.value === 'DRIVER';
  }

  submit() {
    if (this.form.invalid) {
      this.toast.show('Please complete the form', 'warn');
      return;
    }
    const vehicleNumber = this.form.controls.vehicleNumber.value?.trim() ?? '';
    if (this.isDriver && !vehicleNumber) {
      this.toast.show('Driver needs vehicle details', 'warn');
      return;
    }
    const payload = {
      name: this.form.controls.name.value?.trim() ?? '',
      phone: this.form.controls.phone.value?.trim() ?? '',
      role: this.form.controls.role.value as Role,
      email: this.form.controls.email.value?.trim() || undefined,
      vehicleInfo: this.isDriver
        ? {
            type: this.form.controls.vehicleType.value?.trim() || 'Mini Truck',
            number: vehicleNumber
          }
        : undefined
    };
    this.auth.login(payload);
    this.toast.show('Welcome ' + payload.name, 'success');
    const next = payload.role === 'CUSTOMER' ? '/customer' : payload.role === 'DRIVER' ? '/driver' : '/admin';
    this.router.navigateByUrl(next);
  }
}
