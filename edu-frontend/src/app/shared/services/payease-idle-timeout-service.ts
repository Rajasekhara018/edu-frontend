import { Injectable } from '@angular/core';
import { PayeaseIdleTimeoutDailog } from '../payease-idle-timeout-dailog/payease-idle-timeout-dailog';
import { MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class PayeaseIdleTimeoutService {
 idleTimePeriod = 5*60;// Default idle time period in seconds
  isUserActive = false;
  idleTimeout: any;
  idleDetection = false;// Flag to track if idle detection is enabled

  constructor(private dialog: MatDialog) {
    sessionStorage.removeItem("IdleState");// Remove previously stored idle state on session start
    this.getStoredState();// Retrieve stored idle state if any exists
  }
 /* Start the idle timeout process, triggers dialog when time exceeds */
  startIdleTimeout() {
    this.idleTimeout = setTimeout(() => {
      this.openDialog();
      this.disableIdleDetection();
    }, this.idleTimePeriod * 1000);
  }
 /* Called whenever there is user activity to reset idle timeout */
  ping() {
    this.isUserActive = true;
    clearTimeout(this.idleTimeout);
    if (this.idleDetection) {
      this.startIdleTimeout();
    }
  }
 /* Enable idle detection and store the current state */
  enableIdleDetection() {
    this.idleDetection = true;
    this.storeState();
  }
 // Disable idle detection
  disableIdleDetection() {
    this.idleDetection = false;
  }
 /* Open the dialog to warn the user about inactivity */
  private openDialog() {
    const idleDetectionDate = new Date();
    const dialogRef = this.dialog.open(PayeaseIdleTimeoutDailog, {
      hasBackdrop: true,
      backdropClass: 'idle-backdrop',
      disableClose: true,
      data: idleDetectionDate
    });
// Handle dialog close, and if the user interacts, reset the idle timer
    dialogRef.afterClosed().subscribe((result:any) => {
      if (result) {
        this.ping();
      }
    });
  }
/* Retrieve the stored idle state from session storage and apply it */
  getStoredState() {
    const storedState = sessionStorage.getItem('IdleState');
    if (storedState) {
      const state = JSON.parse(storedState);
      this.idleDetection = state.idleDetection;
      this.idleTimePeriod = state.idleTimePeriod;
      if (this.idleDetection) {
        this.startIdleTimeout();
      }
    }
  }
 /* Store the current idle state to session storage */
  storeState() {
    const state = {
      "idleDetection": this.idleDetection,
      "idleTimePeriod": this.idleTimePeriod
    };
    sessionStorage.setItem('IdleState', JSON.stringify(state));
  }
}

