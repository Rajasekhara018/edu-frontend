import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { PayeaseAuthService } from '../../shared/services/payease-auth-service';
import { AesSecurityProviderService } from '../../shared/services/aes-security-provider-service';
import { PayeaseThemeService } from '../../shared/services/payease-theme-service';
import { PayeaseRestservice } from '../../shared/services/payease-restservice';
import { PayeaseIdleTimeoutService } from '../../shared/services/payease-idle-timeout-service';
import { APIPath } from '../../shared/api-enum';
import * as sha512 from 'js-sha512';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  userEmail!: string;
  userPassword!: string;
  inProgressBar = false;
  readonly loginHighlights = [
    'Single workspace for collections, customer lookup, and transaction review',
    'Structured operator flow with wallet funding before payment execution',
    'High-visibility reconciliation with history and daily reporting access'
  ];
  readonly trustMetrics = [
    { value: '99.9%', label: 'Uptime target' },
    { value: '24/7', label: 'Operator access' },
    { value: 'Secure', label: 'Protected sign-in' }
  ];

  hidePwd = true;
  reqFS!: boolean;
  errMsg: string = "Please Enter Valid Credentials";
  loginObj = new LoginObj();
  hide = true;
  loginFeedback = '';
  loginFeedbackTone: 'warn' | 'error' | '' = '';
  changePasswordFeedback = '';
  changePasswordFeedbackTone: 'warn' | 'error' | 'success' | '' = '';

  constructor(public auth: PayeaseAuthService, public router: Router, public aesService: AesSecurityProviderService,
    public themeService: PayeaseThemeService, public postService: PayeaseRestservice, private http: HttpClient,
    private idleTimeoutService: PayeaseIdleTimeoutService, private route: ActivatedRoute) {
    this.themeService.setInitialTheme();
  }

  ngOnInit() {
    const isChangePasswordRoute = this.router.url.includes('/auth/change-password');
    this.isChangePassword = isChangePasswordRoute;
    this.islogin = !isChangePasswordRoute;
    this.screen1 = false;
    this.screen2 = false;

    if (isChangePasswordRoute) {
      this.userEmail = localStorage.getItem('userName') || '';
      if (!this.userEmail) {
        this.router.navigate(['/auth/login']);
      }
      return;
    }

    localStorage.clear();
    sessionStorage.clear();
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
  saltpass!: string;
  isChangePassword!: boolean;
  islogin: boolean = true;
  screen1!: boolean;
  screen2!: boolean;
  login() {
    this.isLoading = true;
    this.loginFeedback = '';
    this.loginFeedbackTone = '';
    const loginPayload = {
      object: {
        userName: this.userEmail,
        password: sha512.sha512(this.userPassword)
      }
    };
    let apiUrl = environment.backendUrl + APIPath.AUTH_LOGIN;
    this.http.post(apiUrl, loginPayload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).subscribe({
      next: (res: any) => {
        this.inProgressBar = false;
        this.isLoading = false;
        const response = res?.object;
        if (response?.mfarequired) {
          localStorage.setItem('email', this.loginObj.email);
          this.router.navigate(['./auth/otp-screen']);
          return;
        }
        if (response?.token || res?.status) {
          const roles: string[] = [];
          if (response?.adminUser) {
            roles.push('ADMIN');
          }
          if (response?.distributeUser) {
            roles.push('DISTRIBUTOR');
          }
          if (response?.retailUser) {
            roles.push('AGENT');
          }
          sessionStorage.setItem('token', 'EDUTECH234156');
          if (response?.fullName) {
            localStorage.setItem('name', response.fullName);
          }
          if (response?.emailId) {
            localStorage.setItem('email', response.emailId);
          }
          localStorage.setItem('lastActive', Date.now().toString());
          if (response?.id) {
            localStorage.setItem('userId', response.id);
          }
          if (response?.status) {
            localStorage.setItem('userStatus', response.status);
          }
          if (response?.userName) {
            localStorage.setItem('userName', response.userName);
          }
          if (roles.length > 0) {
            localStorage.setItem('LoggedInUserroles', JSON.stringify(roles));
          } else {
            localStorage.removeItem('LoggedInUserroles');
          }
          if (response?.forcePasswordChange) {
            this.router.navigate(['./auth/change-password']);
            this.postService.showToast('success', "Change Password is Required");
          } else {
            this.router.navigate(['/home']);
            this.postService.showToast('success', res.errorMsg);
          }
        } else {
          this.setLoginFeedback(res?.errorMsg?.toString() || 'Login failed. Please try again.');
        }
      },
      error: (err) => {
        this.inProgressBar = false;
        this.isLoading = false;
        console.error('Login error:', err);
        this.setLoginFeedback(err?.errorMessage?.toString() || 'Login failed. Please try again.');
      }
    });
  }
  isLoading!: boolean;
  localLogin(username: string, password: string) {
    this.inProgressBar = true;
    this.isLoading = true;
    if (username == 'superadmin' && password == 'Password@123') {
      setTimeout(() => {
        sessionStorage.setItem('token', 'tou123');
        localStorage.setItem('token', 'tou123');
        this.router.navigate(['/home']);
        // this.snackBar.open('Logged In Successfully', '', { duration: 2000, panelClass: "snackbar-btn" });
        this.postService.showToast('success', 'Logged in successfully.');
      }, 5000);
      this.reqFS = true;
    } else {
      setTimeout(() => {
        this.inProgressBar = false;
        this.isLoading = false;
        this.reqFS = false;
        // this.snackBar.open('Authentication required – please enter your valid username and password.', '', { duration: 2000, panelClass: "snackbar-btn" });
        this.postService.showToast('error', 'Authentication required. Please enter a valid username and password.');
      }, 5000);
    }
  }

  showPassword = false;

  isPassword: boolean = true;
  isForgetPassword!: boolean;
  isDisabled!: boolean;
  continueWithEmail() {
    this.isPassword = false;
  }
  continueWithPassword() {
    this.isPassword = true;
  }
  continueWithForgetPassword() {
    this.isForgetPassword = true;
  }
  cancel() {
    this.isPassword = true;
    this.isForgetPassword = false;
  }
  showContextMenu = false;
  x = 0;
  y = 0;

  contextMenuItems = [
    {
      label: 'View',
      icon: 'bi bi-grid-3x3-gap',
      children: this.getViewOptions('View'),
    },
    {
      label: 'Sort by',
      icon: 'bi bi-sort-up',
      children: this.getViewOptions('Sort by'),
    },
    {
      label: 'Group by',
      icon: 'bi bi-layers',
      children: this.getViewOptions('Group by'),
    },
    {
      label: 'Undo Delete',
      icon: 'bi bi-arrow-counterclockwise',
      shortcut: 'Ctrl+Z',
    },
    {
      label: 'New',
      icon: 'bi bi-plus-square',
      children: this.getViewOptions('New'),
    },
    {
      label: 'Properties',
      icon: 'bi bi-info-circle',
      shortcut: 'Alt+Enter',
    },
    {
      label: 'Open in Terminal',
      icon: 'bi bi-terminal',
    },
    {
      label: 'Show more options',
      icon: 'bi bi-three-dots',
      children: this.getViewOptions('Show more options'),
    },
  ];

  hasChildren(item: any): boolean {
    const children = this.getViewOptions(item.label);
    return children && children.length > 0;
  }
  getViewOptions(parent: string) {
    switch (parent) {
      case 'View':
        return [
          { label: 'Extra large icons', icon: 'bi bi-display', shortcut: 'Ctrl+Shift+1' },
          { label: 'Large icons', icon: 'bi bi-display', shortcut: 'Ctrl+Shift+2' },
          { label: 'Medium icons', icon: 'bi bi-display', shortcut: 'Ctrl+Shift+3' },
          { label: 'Small icons', icon: 'bi bi-display', shortcut: 'Ctrl+Shift+4' },
        ];

      case 'Sort by':
        return [
          { label: 'Name', icon: 'bi bi-sort-alpha-down', shortcut: 'Ctrl+N' },
          { label: 'Date modified', icon: 'bi bi-clock', shortcut: 'Ctrl+D' },
          { label: 'Type', icon: 'bi bi-tag', shortcut: 'Ctrl+T' },
          { label: 'Size', icon: 'bi bi-arrows-collapse', shortcut: 'Ctrl+S' },
        ];

      case 'Group by':
        return [
          { label: 'None', icon: 'bi bi-x-circle' },
          { label: 'Date', icon: 'bi bi-calendar2-week' },
          { label: 'Type', icon: 'bi bi-tag' },
          { label: 'Size', icon: 'bi bi-arrows-collapse' },
        ];

      case 'New':
        return [
          { label: 'Folder', icon: 'bi bi-folder-plus' },
          { label: 'Text Document', icon: 'bi bi-file-earmark-text' },
          { label: 'Word Document', icon: 'bi bi-file-earmark-word' },
          { label: 'Excel Sheet', icon: 'bi bi-file-earmark-excel' },
        ];

      case 'Show more options':
        return [
          { label: 'Refresh', icon: 'bi bi-arrow-repeat', shortcut: 'F5' },
          { label: 'Paste', icon: 'bi bi-clipboard', shortcut: 'Ctrl+V' },
          { label: 'Paste shortcut', icon: 'bi bi-link' },
          { label: 'Properties', icon: 'bi bi-info-circle', shortcut: 'Alt+Enter' },
        ];

      default:
        return [];
    }
  }


  onRightClick(event: MouseEvent) {
    event.preventDefault();
    this.x = event.clientX;
    this.y = event.clientY;
    this.showContextMenu = true;
  }

  hideContextMenu() {
    this.showContextMenu = false;
  }

  onAction(item: any, event: any) {
    console.log('Action triggered:', item.label);
    this.hideContextMenu();
  }

  viewType: string = 'list';

  files = [
    { name: 'Document.pdf', type: 'PDF', size: '1.2 MB', modified: '2025-06-21', icon: 'bi bi-file-earmark-pdf' },
    { name: 'Image.png', type: 'Image', size: '600 KB', modified: '2025-06-20', icon: 'bi bi-file-image' },
    { name: 'Report.docx', type: 'Word Document', size: '850 KB', modified: '2025-06-18', icon: 'bi bi-file-earmark-word' },
    { name: 'Sheet.xlsx', type: 'Excel Sheet', size: '700 KB', modified: '2025-06-17', icon: 'bi bi-file-earmark-excel' },
    { name: 'Video.mp4', type: 'Video', size: '15 MB', modified: '2025-06-15', icon: 'bi bi-file-play' },
  ];

  changeView(view: string) {
    this.viewType = view;
  }
  iconSize: 'l' | 'm' | 's' = 'l'; // Could be switched via menu or button
  getIconSizeClass(): string {
    switch (this.viewType) {
      case 'xl': return 'fs-1';       // Large icon
      case 'l': return 'fs-2';
      case 'm': return 'fs-3';       // Medium icon
      case 's': return 'fs-5';       // Small icon
      default: return 'fs-1';
    }
  }
  getCardSizeStyle(): any {
    switch (this.viewType) {
      case 'xl': return { width: '220px', padding: '20px' };
      case 'l': return { width: '200px', padding: '20px' };
      case 'm': return { width: '180px', padding: '16px' };
      case 's': return { width: '160px', padding: '16px' };
      default: return { width: '180px', padding: '16px' };
    }
  }

  // breadcrumbPath = [
  //   { label: 'This PC', icon: 'bi bi-display', path: '/this-pc' },
  //   { label: 'New Volume (D:)', icon: '', path: '/this-pc/d' },
  //   { label: 'sts-4.27.0.RELEASE', icon: '', path: '/this-pc/d/sts' },
  // ];

  onNavigate(path: string) {
    // Handle navigation logic here
    console.log('Navigating to:', path);
  }

  breadcrumbPath = [
    { label: 'Home', path: '/home' },
    { label: 'Gallery', path: '/home/gallery' },
    { label: 'Pictures', path: '/home/gallery/pictures', active: true },
  ];

  dropdownFolders = [
    'Home', 'Gallery', 'Desktop', 'Documents', 'Downloads',
    'Music', 'Pictures', 'Videos', 'Rajasekhara Reddy', 'This PC'
  ];
  // dropdownFolders: string[] = [];
  folderTree: any = {
    Home: ['Gallery', 'Desktop', 'Documents', 'Downloads'],
    Gallery: ['Pictures', 'Videos'],
    Desktop: [],
    Documents: ['Work', 'Personal'],
    Downloads: [],
    Music: [],
    Pictures: ['Vacations', 'Events'],
    Videos: [],
    'Rajasekhara Reddy': [],
    'This PC': ['Home']
  };

  updateDropdownFolders() {
    const current = this.breadcrumbPath[this.breadcrumbPath.length - 1]?.label;
    this.dropdownFolders = this.folderTree[current] || [];
  }


  onSelectDropdown(folder: string) {
    console.log('Selected folder from dropdown:', folder);
    // Navigate to selected folder logic here
  }
  // Inq() {
  //   this.postService.doPostInq(APIPath.USERSETTINGS_VIEW, '1').subscribe((response: any) => {
  //     if (response.success) {
  //       this.settingsObj = response.responseObject;
  //       this.settingsObj.roles = response.responseObject.roles;
  //       this.settingsObj.departments = response.responseObject.departments;
  //       localStorage.setItem('roles', JSON.stringify(this.settingsObj.roles));
  //       localStorage.setItem('departments', JSON.stringify(this.settingsObj.departments));
  //       this.postService.showToast('success', response?.message?.toString())
  //     } else {
  //       this.postService.showToast('error', response?.message?.toString());
  //     }
  //   },
  //     (error: ErrorMessageModule) => {
  //       this.postService.showToast('error', error?.errorMessage?.toString());
  //     })
  // }
  currentPassword!: string;
  newPassword!: string;
  confirmPassword!: string;
  hideConfirmPassword!: boolean;
  nextScreen() {
    this.screen1 = true;
    this.isChangePassword = false;
    this.islogin = false;
    this.changePasswordFeedback = '';
    this.changePasswordFeedbackTone = '';
  }
  backbtn() {
    if (this.router.url.includes('/auth/change-password')) {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.islogin = true;
    this.isChangePassword = false;
    this.screen1 = false;
  }
  changePassword(curntPwd: any, newPwd: any, cnfrmPwd: any) {
    this.changePasswordFeedback = '';
    this.changePasswordFeedbackTone = '';

    if (!this.userEmail) {
      this.setChangePasswordFeedback('User session not found. Please sign in again.', 'error');
      return;
    }

    if (!curntPwd || !newPwd || !cnfrmPwd) {
      this.setChangePasswordFeedback('All password fields are required.', 'error');
      return;
    }

    if (newPwd !== cnfrmPwd) {
      this.setChangePasswordFeedback('New password and confirm password do not match.', 'error');
      return;
    }

    if (newPwd.length < 8) {
      this.setChangePasswordFeedback('New password must be at least 8 characters long.', 'error');
      return;
    }

    this.isLoading = true;
    const requestPayload = {
      userName: this.userEmail,
      oldPassword: sha512.sha512(curntPwd),
      password: sha512.sha512(newPwd)
    };

    this.postService.doPost(APIPath.AUTH_CHANGE_PASSWORD, requestPayload, 'CHANGE_PASSWORD').subscribe({
      next: (response: any) => {
        this.isLoading = false;
        if (response?.status) {
          localStorage.setItem('userStatus', response?.object?.status || 'ACTIVE');
          this.setChangePasswordFeedback(response?.errorMsg?.toString() || 'Password changed successfully.', 'success');
          this.screen1 = false;
          this.screen2 = true;
        } else {
          this.setChangePasswordFeedback(response?.errorMsg?.toString() || 'Password change failed.', 'error');
        }
      },
      error: (err: any) => {
        this.isLoading = false;
        this.setChangePasswordFeedback(err?.errorMessage?.toString() || 'Password change failed.', 'error');
      }
    });
  }
  cancelChangePassword() {
    this.backbtn();
  }
  pwdSuccess() {
    this.router.navigate(['/home']);
  }

  forgetPassword() {
    this.router.navigate(['/auth/forget-password']);
  }

  private setLoginFeedback(message: string) {
    this.loginFeedback = message;
    const isPending = message.toLowerCase().includes('pending');
    this.loginFeedbackTone = isPending ? 'warn' : 'error';
    this.postService.showToast(isPending ? 'warn' : 'error', message);
  }

  private setChangePasswordFeedback(message: string, tone: 'warn' | 'error' | 'success') {
    this.changePasswordFeedback = message;
    this.changePasswordFeedbackTone = tone;
    this.postService.showToast(tone, message);
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
