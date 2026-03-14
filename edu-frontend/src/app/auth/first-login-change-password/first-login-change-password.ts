import { Component } from '@angular/core';
import { Router } from '@angular/router';
import * as sha512 from 'js-sha512';

import { APIPath } from '../../shared/api-enum';
import { PayeaseRestservice } from '../../shared/services/payease-restservice';
import { PayeaseThemeService } from '../../shared/services/payease-theme-service';

@Component({
  selector: 'app-first-login-change-password',
  standalone: false,
  templateUrl: './first-login-change-password.html',
  styleUrl: './first-login-change-password.scss'
})
export class FirstLoginChangePassword {
  userName = '';
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  feedback = '';
  feedbackTone: 'error' | 'success' | '' = '';

  constructor(
    private router: Router,
    private postService: PayeaseRestservice,
    private themeService: PayeaseThemeService
  ) {
    this.themeService.setInitialTheme();
  }

  ngOnInit() {
    this.userName = localStorage.getItem('userName') || '';
    if (!this.userName) {
      this.router.navigate(['/auth/login']);
    }
  }

  submit() {
    this.feedback = '';
    this.feedbackTone = '';

    if (!this.userName) {
      this.setFeedback('User session not found. Please sign in again.', 'error');
      return;
    }

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.setFeedback('All password fields are required.', 'error');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.setFeedback('New password and confirm password do not match.', 'error');
      return;
    }

    if (this.newPassword.length < 8) {
      this.setFeedback('New password must be at least 8 characters long.', 'error');
      return;
    }

    this.isLoading = true;
    const requestPayload = {
      userName: this.userName,
      oldPassword: sha512.sha512(this.currentPassword),
      password: sha512.sha512(this.newPassword)
    };

    this.postService.doPost(APIPath.AUTH_CHANGE_PASSWORD, requestPayload, 'CHANGE_PASSWORD').subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response?.status) {
          localStorage.setItem('userStatus', response?.object?.status || 'ACTIVE');
          this.setFeedback(response?.errorMsg?.toString() || 'Password changed successfully.', 'success');
          setTimeout(() => this.router.navigate(['/home']), 900);
        } else {
          this.setFeedback(response?.errorMsg?.toString() || 'Password change failed.', 'error');
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.setFeedback(err?.errorMessage?.toString() || 'Password change failed.', 'error');
      }
    });
  }

  backToLogin() {
    this.router.navigate(['/auth/login']);
  }

  get passwordChecks() {
    return [
      { label: 'At least 8 characters', passed: this.newPassword.length >= 8 },
      { label: 'One uppercase letter', passed: /[A-Z]/.test(this.newPassword) },
      { label: 'One lowercase letter', passed: /[a-z]/.test(this.newPassword) },
      { label: 'One number', passed: /[0-9]/.test(this.newPassword) },
      { label: 'One special character', passed: /[^A-Za-z0-9]/.test(this.newPassword) },
      { label: 'Passwords match', passed: !!this.confirmPassword && this.newPassword === this.confirmPassword }
    ];
  }

  get strengthScore(): number {
    return this.passwordChecks.slice(0, 5).filter((check) => check.passed).length;
  }

  get strengthPercent(): number {
    return (this.strengthScore / 5) * 100;
  }

  get strengthLabel(): string {
    if (this.strengthScore <= 2) {
      return 'Weak';
    }
    if (this.strengthScore <= 4) {
      return 'Good';
    }
    return 'Strong';
  }

  private setFeedback(message: string, tone: 'error' | 'success') {
    this.feedback = message;
    this.feedbackTone = tone;
    this.postService.openSnackBar(message, tone === 'success' ? 'SUCCESS' : 'ERROR');
  }
}
