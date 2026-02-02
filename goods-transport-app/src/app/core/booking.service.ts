import { Injectable, signal, computed } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { Booking, BookingStatus } from './models';

@Injectable({ providedIn: 'root' })
export class BookingService {
  private readonly bookingsSignal = signal<Booking[]>(this.storage.read<Booking[]>('app_bookings', []));
  readonly bookings = computed(() => this.bookingsSignal());

  constructor(private readonly storage: LocalStorageService) {}

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
    this.bookingsSignal.set([...this.bookingsSignal(), booking]);
    this.persist();
  }

  update(updated: Booking) {
    const list = this.bookingsSignal().map((booking) => (booking.id === updated.id ? updated : booking));
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
}
