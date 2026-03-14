import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PayeaseIdleTimeoutService } from '../../shared/services/payease-idle-timeout-service';
import { PayeaseRestservice } from '../../shared/services/payease-restservice';
import { AesSecurityProviderService } from '../../shared/services/aes-security-provider-service';
import { HttpClient } from '@angular/common/http';
import { PayeaseAuthService } from '../../shared/services/payease-auth-service';
import { PayeaseThemeService } from '../../shared/services/payease-theme-service';
import { APIPath } from '../../shared/api-enum';
import * as sha512 from 'js-sha512';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  isDisabled = false;
  isSubmitting = false;
  isCheckMail = false;
  userEmail = '';
  submittedEmail = '';
  resetToken = '';
  newPassword = '';
  confirmPassword = '';
  showNewPassword = false;
  showConfirmPassword = false;
  feedback = '';
  feedbackTone: 'error' | 'success' | '' = '';
  readonly securityPoints = [
    'Recovery requests are sent only to registered operator email addresses.',
    'Use the latest email from support if your organization recently changed domains.',
    'If the message does not arrive, review spam and quarantine filters before retrying.'
  ];

  constructor(public auth: PayeaseAuthService, public router: Router, public aesService: AesSecurityProviderService,
    public themeService: PayeaseThemeService, public postService: PayeaseRestservice, private http: HttpClient,
    private idleTimeoutService: PayeaseIdleTimeoutService, private route: ActivatedRoute) {
    this.themeService.setInitialTheme();
  }

  ngOnInit() {
    localStorage.clear();
    sessionStorage.clear();
    this.route.queryParamMap.subscribe((params) => {
      this.resetToken = params.get('token') || '';
    });
  }

  get isResetMode(): boolean {
    return !!this.resetToken;
  }

  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  keyInputHandler(event: any) {
    const pattern = new RegExp('^[0-9]+$');
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  DisableCut(event: any) {
    event.preventDefault();
  }

  DisableCopy(event: any) {
    event.preventDefault();
  }

  DisablePaste(event: any) {
    event.preventDefault();
  }

  DisableAuto(event: any) {
    event.preventDefault();
  }

  submitResetRequest() {
    if (!this.userEmail?.trim() || !this.isValidEmail(this.userEmail)) {
      this.postService.showToast('error', 'Enter a valid work email to continue.');
      return;
    }

    const requestBody = {
      emailId: this.userEmail.trim(),
    };

    this.isSubmitting = true;
    localStorage.setItem('email', this.userEmail.trim());

    const apiUrl = this.postService.getBaseUrl() + APIPath.FORGOT_PASSWORD;
    this.http.post(apiUrl, { reqType: 'FORGOT_PASSWORD', object: requestBody }).subscribe({
      next: (res: any) => {
        this.isSubmitting = false;
        if (res?.success) {
          this.submittedEmail = this.userEmail.trim();
          this.isCheckMail = true;
          this.postService.showToast('success', 'Reset instructions have been sent to your email.');
          return;
        }

        this.postService.showToast('error', res?.message?.toString() || 'We could not start the password reset flow.');
      },
      error: (err) => {
        this.isSubmitting = false;
        this.postService.showToast('error', err?.error?.message?.toString() || 'Password reset request failed.');
      }
    });
  }

  resendResetRequest() {
    this.submitResetRequest();
  }

  submitPasswordReset() {
    this.feedback = '';
    this.feedbackTone = '';

    if (!this.resetToken) {
      this.setFeedback('This reset link is invalid or missing.', 'error');
      return;
    }

    if (!this.newPassword || !this.confirmPassword) {
      this.setFeedback('Both password fields are required.', 'error');
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

    if (this.strengthScore < 5) {
      this.setFeedback('Password must include uppercase, lowercase, number, and special character.', 'error');
      return;
    }

    this.isSubmitting = true;
    this.postService.doPost(APIPath.AUTH_RESET_PASSWORD, {
      resetPasswordToken: this.resetToken,
      password: sha512.sha512(this.newPassword)
    }, 'RESET_PASSWORD').subscribe({
      next: (response: any) => {
        this.isSubmitting = false;
        if (response?.status) {
          this.setFeedback(response?.errorMsg?.toString() || 'Password has been reset successfully.', 'success');
          setTimeout(() => this.router.navigate(['/auth/login']), 1000);
        } else {
          this.setFeedback(response?.errorMsg?.toString() || 'Password reset failed.', 'error');
        }
      },
      error: (err: any) => {
        this.isSubmitting = false;
        this.setFeedback(err?.errorMessage?.toString() || 'Password reset failed.', 'error');
      }
    });
  }

  cancel() {
    this.router.navigate(['/auth/login']);
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

  private isValidEmail(value: string): boolean {
    return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(value.trim());
  }

  private setFeedback(message: string, tone: 'error' | 'success') {
    this.feedback = message;
    this.feedbackTone = tone;
    this.postService.showToast(tone, message);
  }
}
