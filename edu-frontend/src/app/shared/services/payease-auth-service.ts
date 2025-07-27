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

  isloggedin() {
    if (sessionStorage.getItem('token') || localStorage.getItem('token')) {
      return true;
    } else {
      return false;
    }
  }

  canActivate(url: any) {
    if (this.isloggedin()) { return true; }
    this.redirectUrl = url;
    this.router.navigate(['/']);
    return false;
  }

}

