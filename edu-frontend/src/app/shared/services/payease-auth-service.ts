import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PayeaseAuthService {
  redirectUrl!: string;

  constructor(private router: Router, public http: HttpClient, @Inject(PLATFORM_ID) public platformId: object) {

  }

  isloggedin(): boolean {
    return !!(sessionStorage.getItem('token') || localStorage.getItem('token'));
  }

  canActivate(url: string): boolean {
    if (this.isloggedin()) { return true; }
    this.redirectUrl = url;
    this.router.navigate(['/auth/login']);
    return false;
  }

}

