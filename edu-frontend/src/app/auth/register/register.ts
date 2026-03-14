import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { PayeaseAuthService } from '../../shared/services/payease-auth-service';
import { AesSecurityProviderService } from '../../shared/services/aes-security-provider-service';
import { PayeaseThemeService } from '../../shared/services/payease-theme-service';
import { PayeaseRestservice } from '../../shared/services/payease-restservice';
import { PayeaseIdleTimeoutService } from '../../shared/services/payease-idle-timeout-service';
import { APIPath } from '../../shared/api-enum';
import { Customer } from '../../shared/model';
declare var bootstrap: any;

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  // settingsObj = new UserSettings();
  userEmail!: string;
  userPassword: string = '';
  inProgressBar = false;
  readonly onboardingSteps = [
    'Create your distributor profile with personal and business details.',
    'Enable faster review by completing accurate contact and address information.',
    'Move into the payments workspace after distributor approval.'
  ];
  readonly trustMetrics = [
    { value: 'Distributor', label: 'Signup route' },
    { value: 'Secure', label: 'Application flow' },
    { value: 'Ready', label: 'Payments workspace' }
  ];

  hidePwd = true;
  reqFS!: boolean;
  errMsg: string = "Please Enter Valid Credentials";
  loginObj = new LoginObj();
  hide = true;
  disabledMode!: boolean;
  customerObj = new Customer();
  isLoading!: boolean;
  constructor(public auth: PayeaseAuthService, public router: Router, public aesService: AesSecurityProviderService,
    public themeService: PayeaseThemeService, public postService: PayeaseRestservice, private http: HttpClient,
    private idleTimeoutService: PayeaseIdleTimeoutService) {
    this.themeService.setInitialTheme();
  }

  ngOnInit() {
    localStorage.clear();
    sessionStorage.clear();
    this.setDistributorDefaults();
    // this.Inq();
  }
  register() {
    const requestObj: any = {
      ...this.customerObj,
      adminUser: false,
      distributeUser: true,
      retailUser: false
    };
    this.postService.doPost(APIPath.AUTH_REGISTER, requestObj, "SIGNUP").subscribe({
      next: (response: any) => {
        if (response.status) {
          this.customerObj = response.status;
          this.postService.showToast('success', response?.message?.toString());
        } else {
          this.postService.showToast('error', response?.message?.toString());
        }
      },
      error: (err: any) => {
        this.postService.showToast('error', err?.message?.toString());
      }
    });
  }

  private setDistributorDefaults() {
    this.customerObj.adminUser = false;
    this.customerObj.distributeUser = true;
    this.customerObj.retailUser = false;
  }
}

export class LoginObj {
  salt!: string;
  email!: string;
  userName!: string;
  password!: string;
  encryptedUserName!: string;
  encryptedPassword!: string;
}

