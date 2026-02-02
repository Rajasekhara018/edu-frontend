import { Injectable, signal, computed } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { VehicleType } from './models';

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private readonly vehicleSignal = signal<VehicleType[]>(this.storage.read<VehicleType[]>('app_vehicle_types', []));
  readonly vehicles = computed(() => this.vehicleSignal());

  constructor(private readonly storage: LocalStorageService) {}

  private persist() {
    this.storage.write('app_vehicle_types', this.vehicleSignal());
  }

  addVehicle(vehicle: VehicleType) {
    this.vehicleSignal.set([...this.vehicleSignal(), vehicle]);
    this.persist();
  }

  updateVehicle(updated: VehicleType) {
    const list = this.vehicleSignal().map((vehicle) => (vehicle.id === updated.id ? updated : vehicle));
    this.vehicleSignal.set(list);
    this.persist();
  }

  toggleVehicle(id: string) {
    const list = this.vehicleSignal().map((vehicle) =>
      vehicle.id === id ? { ...vehicle, enabled: !vehicle.enabled } : vehicle
    );
    this.vehicleSignal.set(list);
    this.persist();
  }

  getVehicleById(id: string) {
    return this.vehicleSignal().find((vehicle) => vehicle.id === id) ?? null;
  }
}
