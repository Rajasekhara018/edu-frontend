import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LoginObj } from '../../auth/login/login';
import { HttpClient } from '@angular/common/http';
import { AesSecurityProviderService } from '../services/aes-security-provider-service';
import { PayeaseRestservice } from '../services/payease-restservice';
import { PayeaseIdleTimeoutService } from '../services/payease-idle-timeout-service';

@Component({
  selector: 'app-payease-idle-timeout-dailog',
  standalone: false,
  templateUrl: './payease-idle-timeout-dailog.html',
  styleUrl: './payease-idle-timeout-dailog.scss'
})
export class PayeaseIdleTimeoutDailog {
  hidePwd = true;
  inProgressBar = false;
  errMsg!: string;
  loginObj = new LoginObj();
  isSession!: boolean;
  intervalId: any;
  username: any;
  sessionTime: any;
  sessionTimeMin = 1;
  sessionTimeSec = 0;
  formattedSessionTime: any;
  reqFS = false;
  islogin: boolean = true;
  loggedIn: boolean = false;
  screen1: boolean = true;
  screen2: boolean = false;
  screen3: boolean = false;
  idlepopOpeningTime!: Date;
  saltpass!: string;
  encrypt: any;
  constructor(private router: Router, private snackBar: MatSnackBar, public dialogRef: MatDialogRef<PayeaseIdleTimeoutDailog>, private idleTimeoutService: PayeaseIdleTimeoutService,
    @Inject(MAT_DIALOG_DATA) public data: Date, public postService: PayeaseRestservice, public aesService: AesSecurityProviderService, private http: HttpClient) { }
  ngOnInit() {
    this.isSession = true;
    this.startCount();
    this.username = sessionStorage.getItem('loggedInUser')!;
  }
  /* Starts the countdown timer for the user session. */
  startCount() {
    if (this.isSession) {
      this.sessionTime = (this.sessionTimeMin * 60) + (this.sessionTimeSec);
      this.intervalId = setInterval(() => {
        if (this.sessionTime > 0) {
          this.sessionTime--;
          const minutes = Math.floor(this.sessionTime / 60);
          const seconds = this.sessionTime % 60;
          this.formattedSessionTime = `${minutes.toString().padStart(2, '0')} m:${seconds.toString().padStart(2, '0')}s`;
        } else {
          this.clearTimer();
          this.isSession = false;
          this.idleTimeoutService.disableIdleDetection();
          sessionStorage.clear();
        }
      }, 1000);
    }
  }


  /* Clears the session timer interval. */
  clearTimer() {
    clearInterval(this.intervalId);
  }

  /* Prevents the default action when the Enter key is pressed. */
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  /* Restricts input to numeric values only. */
  keyInputHandler(event: any) {
    const pattern = new RegExp('^[0-9]+$');
    if (!pattern.test(event.key)) {
      event.preventDefault();
    }
  }

  /* Logs out the user, clears session data, and navigates to the home page. */
  logout() {
    this.dialogRef.close(false);
    sessionStorage.clear();
    this.idleTimeoutService.disableIdleDetection();
    this.clearTimer();
    this.router.navigate(['/']);
  }

  /*  Continues the user session by resetting idle detection and timer. */
  continueSession() {
    const latestTime = new Date();
    const warningTimeInms = (this.sessionTimeMin * 60 + this.sessionTimeSec) * 1000;
    const idletimeDiff = latestTime.getTime() - this.data.getTime();
    if (idletimeDiff > warningTimeInms) {
      this.isSession = false;
    }
    else {
      this.isSession = true;
    }
    this.idleTimeoutService.ping()
    this.idleTimeoutService.enableIdleDetection();
    this.clearTimer();
    this.dialogRef.close(true);
  }

  PreLogin() {
    this.loginObj.email = localStorage.getItem('email') || '';

    if (!this.loginObj.password || !this.loginObj.email) {
      this.postService.openSnackBar('Email and Password are required', 'ERROR');
      return;
    }

    // this.callPreTokenize();
  }

  // callPreTokenize() {
  //   this.saltpass = Math.random().toString(36).substring(2, 8);
  //   console.log('Generated salt:', this.saltpass);

  //   const url = this.postService.getBaseUrl() + APIPath.PRE_TOKENIZE;

  //   this.http.post<any>(url, {}).subscribe({
  //     next: (res) => {
  //       const pubVal = res?.responseObject?.pub_val;
  //       const keyIndex = res?.responseObject?.key_index;

  //       if (!pubVal || !keyIndex) {
  //         this.postService.openSnackBar('Invalid pre-tokenize response.', 'ERROR');
  //         return;
  //       }

  //       // Format public key with line breaks
  //       const formattedPubKey = pubVal.match(/.{1,64}/g)?.join('\n');
  //       const publicKey = `-----BEGIN PUBLIC KEY-----\n${formattedPubKey}\n-----END PUBLIC KEY-----`;

  //       // 🔐 Ensure encrypt is initialized
  //       if (!this.encrypt) this.encrypt = new JSEncrypt();

  //       this.encrypt.setPublicKey(publicKey);

  //       const combinedPassword = this.loginObj.password + this.saltpass;
  //       const encryptedPassword = this.encrypt.encrypt(combinedPassword);
  //       const encryptedSalt = this.encrypt.encrypt(this.saltpass);

  //       if (!encryptedPassword || !encryptedSalt) {
  //         this.postService.openSnackBar('Encryption failed. Please try again.', 'ERROR');
  //         return;
  //       }

  //       this.loginObj.keyValue = encryptedSalt;
  //       this.loginObj.keyIndex = keyIndex;
  //       this.loginObj.encryptedPassword = encryptedPassword;

  //       this.login(); // ✅ call login
  //     },
  //     error: (err) => {
  //       console.error('Error in pre-tokenize:', err);
  //       this.postService.openSnackBar('Pre-tokenize failed.', 'ERROR');
  //     }
  //   });
  // }


  // login() {
  //   this.inProgressBar = true;

  //   const email = this.loginObj.email;
  //   const password = this.loginObj.encryptedPassword;

  //   if (!email || !password || !this.loginObj.keyIndex || !this.loginObj.keyValue) {
  //     this.inProgressBar = false;
  //     this.postService.openSnackBar('Missing credentials or key info.', 'ERROR');
  //     return;
  //   }

  //   const apiUrl = this.postService.getBaseUrl() + APIPath.USER_AUTHENTICATE;

  //   const payload = {
  //     keyValue: this.loginObj.keyValue,
  //     keyIndex: this.loginObj.keyIndex,
  //     requestObject: {
  //       email: email,
  //       password: password
  //     }
  //   };

  //   this.http.post(apiUrl, payload).subscribe({
  //     next: (res: any) => {
  //       this.inProgressBar = false;

  //       if (res?.success && res?.responseObject?.token) {
  //         const response = res.responseObject;
  //         sessionStorage.setItem('token', response.token);
  //         localStorage.setItem('token', response.token);
  //         localStorage.setItem('email', response.email);
  //         localStorage.setItem('lastActive', Date.now().toString());
  //         localStorage.setItem('id', response.id);
  //         localStorage.setItem('userStatus', response.userStatus);
  //         localStorage.setItem('currentFailedLoginCount', response.currentFailedLoginCount);
  //         sessionStorage.setItem('roleTitle', response.role);
  //         localStorage.setItem('p', response.privilege);

  //         if (response.forcePasswordChange) {
  //           this.islogin = false;
  //           this.loggedIn = true;
  //           this.screen1 = true;
  //           this.screen2 = false;
  //           this.screen3 = false;
  //         } else {
  //           this.router.navigate(['/home']);
  //           this.postService.openSnackBar('Logged In Successfully', 'SUCCESS');
  //         }
  //       } else {
  //         this.postService.openSnackBar('Enter Valid Credentials', 'ERROR');
  //       }
  //     },
  //     error: (err) => {
  //       this.inProgressBar = false;
  //       console.error(err);
  //       this.postService.openSnackBar('Login failed. Please try again.', 'ERROR');
  //     }
  //   });
  // }
}


