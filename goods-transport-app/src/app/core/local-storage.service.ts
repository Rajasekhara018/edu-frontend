import { Injectable } from '@angular/core';
import { Booking, PricingRule, User, VehicleType } from './models';

interface StoragePayload<T> {
  key: string;
  seed: T;
}

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly storage = window.localStorage;
  private readonly seeds: StoragePayload<any>[] = [
    {
      key: 'app_users',
      seed: [
        { id: 'u-admin', role: 'ADMIN' as const, name: 'System Admin', phone: '555-0001', email: 'admin@goods.com' },
        { id: 'u-customer', role: 'CUSTOMER' as const, name: 'Alice Patel', phone: '555-0101' },
        {
          id: 'u-driver',
          role: 'DRIVER' as const,
          name: 'Ravi Mehta',
          phone: '555-0202',
          vehicleInfo: { type: 'Mini Truck', number: 'MH12AX3456' }
        }
      ]
    },
    { key: 'app_session', seed: null },
    {
      key: 'app_vehicle_types',
      seed: [
        { id: 'vt-1', name: 'Mini Truck', capacityKg: 1200, baseFare: 700, perKmRate: 28, enabled: true },
        { id: 'vt-2', name: 'Medium Truck', capacityKg: 2500, baseFare: 1100, perKmRate: 45, enabled: true }
      ] as VehicleType[]
    },
    {
      key: 'app_pricing_rules',
      seed: [
        { id: 'pr-default', name: 'Standard', taxPercent: 12, surgeMultiplier: 1 },
        { id: 'pr-peak', name: 'Peak', taxPercent: 12, surgeMultiplier: 1.2 }
      ] as PricingRule[]
    },
    {
      key: 'app_addresses',
      seed: [
        { id: 'addr-1', label: 'Warehouse East', address: '101 East Park Lane' },
        { id: 'addr-2', label: 'North Hub', address: '22 North Drive' },
        { id: 'addr-3', label: 'South Depot', address: '7 South Boulevard' }
      ]
    },
    {
      key: 'app_bookings',
      seed: [] as Booking[]
    }
  ];

  constructor() {
    this.ensureDefaults();
  }

  private ensureDefaults() {
    for (const { key, seed } of this.seeds) {
      if (!this.storage.getItem(key)) {
        this.storage.setItem(key, JSON.stringify(seed));
      }
    }
  }

  read<T>(key: string, fallback: T): T {
    const raw = this.storage.getItem(key);
    if (!raw) {
      this.storage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    try {
      return JSON.parse(raw) as T;
    } catch (error) {
      this.storage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
  }

  write<T>(key: string, value: T): void {
    this.storage.setItem(key, JSON.stringify(value));
  }

  clear(key: string): void {
    this.storage.removeItem(key);
  }
}
