import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PayeaseIdleTimeoutService } from '../../shared/services/payease-idle-timeout-service';
import { PayeaseRestservice } from '../../shared/services/payease-restservice';
import { AesSecurityProviderService } from '../../shared/services/aes-security-provider-service';
import { HttpClient } from '@angular/common/http';
import { PayeaseAuthService } from '../../shared/services/payease-auth-service';
import { PayeaseThemeService } from '../../shared/services/payease-theme-service';
import { APIPath } from '../../shared/api-enum';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss'
})
export class ResetPassword {
  isDisabled!: boolean;
  userEmail!: string;
  isCheckMail!: boolean;
  constructor(public auth: PayeaseAuthService, public router: Router, public aesService: AesSecurityProviderService,
    public themeService: PayeaseThemeService, public postService: PayeaseRestservice, private http: HttpClient,
    private idleTimeoutService: PayeaseIdleTimeoutService) {
    this.themeService.setInitialTheme();
  }

  ngOnInit() {
    localStorage.clear();
    sessionStorage.clear();
    // this.Inq();
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
  ResetPassword() {
    let obj = {
      "requestObject": {
        "email": this.userEmail,
      }
    }
    let apiUrl = '';
    localStorage.setItem('email', this.userEmail);
    apiUrl = this.postService.getBaseUrl() + APIPath.FORGOT_PASSWORD;
    this.http.post(apiUrl, obj).subscribe((res: any) => {
      if (res.success) {
        this.isCheckMail = true;
        this.postService.openSnackBar('Email Sent Successfully', 'SUCCESS');
      } else {
        this.postService.openSnackBar('Email Sent Failed', 'ERROR');
      }
    }, err => {
      console.log(err);
    })
  }
  changePassword() {
    this.router.navigate(['auth/change-password']);
  }
  cancel() {
    this.router.navigate(['/']);
  }
}
