import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root'
})
export class PayeaseSideMenuService {
  private sidenav!: MatSidenav;
  public isSidenavExpanded = false;
  public isSidenavLinkActive = false;

  constructor() { }

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }
  public toggle(): void {
    this.sidenav.toggle();
  }
}