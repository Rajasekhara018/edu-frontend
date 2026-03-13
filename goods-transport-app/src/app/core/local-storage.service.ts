import { Injectable } from '@angular/core';
import { Booking, PricingRule, User, VehicleType } from './models';
import { AppProfileConfigService } from './app-profile-config.service';

interface StoragePayload<T> {
  key: string;
  seed: T;
}

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
  private readonly storage = window.localStorage;
  private readonly profileKey: string;
  private readonly seeds: StoragePayload<any>[];

  constructor(private readonly configService: AppProfileConfigService) {
    const profileData = this.configService.appConfig.data;
    this.profileKey = this.configService.appConfig.branding.key;
    this.seeds = [
      { key: 'app_users', seed: profileData.users as User[] },
      { key: 'app_session', seed: null },
      { key: 'app_vehicle_types', seed: profileData.vehicleTypes as VehicleType[] },
      { key: 'app_pricing_rules', seed: profileData.pricingRules as PricingRule[] },
      { key: 'app_addresses', seed: profileData.addresses },
      { key: 'app_bookings', seed: [] as Booking[] }
    ];
    this.ensureDefaults();
  }

  private ensureDefaults() {
    const previousProfile = this.storage.getItem('app_profile_key');
    if (previousProfile !== this.profileKey) {
      for (const { key } of this.seeds) {
        this.storage.removeItem(key);
      }
    }

    for (const { key, seed } of this.seeds) {
      if (!this.storage.getItem(key)) {
        this.storage.setItem(key, JSON.stringify(seed));
      }
    }

    this.storage.setItem('app_profile_key', this.profileKey);
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
