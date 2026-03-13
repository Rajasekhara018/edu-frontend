import { Injectable, signal, computed } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Booking, BookingStatus, PaymentMethod } from './models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly bookingsSignal = signal<Booking[]>([]);
  readonly bookings = computed(() => this.bookingsSignal());

  constructor(private readonly storage: LocalStorageService) {
    const stored = this.storage.read<Booking[]>('app_bookings', []);
    const normalized = stored.map((booking) => this.normalizeBooking(booking));
    this.bookingsSignal.set(normalized);

    if (JSON.stringify(stored) !== JSON.stringify(normalized)) {
      this.storage.write('app_bookings', normalized);
    }
  }

  private normalizeBooking(booking: Booking): Booking {
    return {
      ...booking,
      payment: booking.payment ?? {
        status: 'PENDING',
        amount: booking.pricing?.total ?? 0,
        method: 'UPI'
      }
    };
  }

  private persist() {
    this.storage.write('app_bookings', this.bookingsSignal());
  }

  private withHistory(booking: Booking, status: BookingStatus, by: string): Booking {
    return {
      ...booking,
      status,
      statusHistory: [...booking.statusHistory, { status, at: Date.now(), by }]
    };
  }

  create(booking: Booking) {
    this.bookingsSignal.set([...this.bookingsSignal(), this.normalizeBooking(booking)]);
    this.persist();
  }

  update(updated: Booking) {
    const normalized = this.normalizeBooking(updated);
    const list = this.bookingsSignal().map((booking) => (booking.id === normalized.id ? normalized : booking));
    this.bookingsSignal.set(list);
    this.persist();
  }

  getById(id: string) {
    return this.bookingsSignal().find((b) => b.id === id) ?? null;
  }

  assignDriver(bookingId: string, driverId: string) {
    const booking = this.getById(bookingId);
    if (!booking) {
      return null;
    }
    const updated = this.withHistory({ ...booking, assignedDriverId: driverId }, 'DRIVER_ASSIGNED', driverId);
    this.update(updated);
    return updated;
  }

  changeStatus(id: string, status: BookingStatus, actorId: string) {
    const booking = this.getById(id);
    if (!booking) {
      return null;
    }
    const updated = this.withHistory(booking, status, actorId);
    this.update(updated);
    return updated;
  }

  cancelBooking(id: string, actorId: string, reason: string) {
    const booking = this.getById(id);
    if (!booking) {
      return null;
    }
    const updated = this.withHistory({ ...booking, cancelReason: reason }, 'CANCELLED', actorId);
    this.update(updated);
    return updated;
  }

  markPaid(id: string, actorId: string, method?: PaymentMethod) {
    const booking = this.getById(id);
    if (!booking) {
      return null;
    }
    if (booking.payment.status === 'PAID') {
      return booking;
    }
    const paidAt = Date.now();
    const paymentMethod: PaymentMethod = method || booking.payment.method || 'UPI';
    const updated = {
      ...booking,
      payment: {
        ...booking.payment,
        status: 'PAID' as const,
        method: paymentMethod,
        paidAt,
        paidBy: actorId,
        transactionRef: booking.payment.transactionRef ?? `pay-${Math.random().toString(36).slice(2, 10)}`
      }
    };
    this.update(updated);
    return updated;
  }
}
