import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { AppProfileConfigService } from '../core/app-profile-config.service';
import { ToastService } from '../shared/toast.service';
import { Role } from '../core/models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginComponent {
  readonly roles: Role[] = ['CUSTOMER', 'DRIVER', 'ADMIN'];
  readonly form: FormGroup;
  submitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly toast: ToastService,
    private readonly profileConfig: AppProfileConfigService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      role: ['CUSTOMER', Validators.required],
      email: [''],
      vehicleType: [''],
      vehicleNumber: ['']
    });
  }

  get isDriver() {
    return this.form.controls.role.value === 'DRIVER';
  }

  get authContent() {
    return this.profileConfig.appConfig.auth;
  }

  async submit() {
    this.form.markAllAsTouched();
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
            type: this.form.controls.vehicleType.value?.trim() || this.authContent.driverVehiclePlaceholder,
            number: vehicleNumber
          }
        : undefined
    };
    this.submitting = true;
    this.auth.login(payload);
    this.toast.show('Welcome ' + payload.name, 'success');

    const roleRoutes: Record<Role, string> = {
      CUSTOMER: '/customer',
      DRIVER: '/driver',
      ADMIN: '/admin'
    };
    const next = roleRoutes[payload.role];

    try {
      const navigated = await this.router.navigateByUrl(next);
      if (!navigated) {
        this.toast.show('Login succeeded, but route navigation failed', 'error');
      }
    } catch {
      this.toast.show('Unable to open the selected workspace', 'error');
    } finally {
      this.submitting = false;
    }
  }
}
