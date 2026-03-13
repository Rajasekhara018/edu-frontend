import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from './core/auth.service';
import { BookingService } from './core/booking.service';
import { ToastContainerComponent } from './shared/toast.component';
import { ToastService } from './shared/toast.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ToastContainerComponent],
  templateUrl: './app.shell.html',
  styleUrls: ['./app.shell.scss']
})
export class AppComponent {
  lookupQuery = '';

  constructor(
    public auth: AuthService,
    private router: Router,
    private bookingService: BookingService,
    private toast: ToastService
  ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/auth']);
  }

  get user() {
    return this.auth.session();
  }

  get lookupResultsCount() {
    return this.findMatchingBookings(this.lookupQuery).length;
  }

  isActive(path: string) {
    return this.router.url.startsWith(path);
  }

  get isAuthPage() {
    return this.router.url.startsWith('/auth');
  }

  get isHomePage() {
    return this.router.url === '/' || this.router.url === '';
  }

  runLookup() {
    if (!this.user) {
      this.toast.show('Login is required to open shipment records', 'info');
      this.router.navigate(['/auth']);
      return;
    }
    const matches = this.findMatchingBookings(this.lookupQuery);
    if (!matches.length) {
      this.toast.show('No shipment match found for the lookup value', 'warn');
      return;
    }
    this.router.navigate(['/booking/detail', matches[0].id]);
  }

  private findMatchingBookings(query: string) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return [];
    }
    return this.bookingService.bookings().filter((booking) => {
      const haystack = [
        booking.id,
        booking.pickup.address,
        booking.drop.address,
        booking.pickup.phone,
        booking.drop.phone,
        booking.goods.category,
        booking.vehicle.type
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(normalized);
    });
  }
}
