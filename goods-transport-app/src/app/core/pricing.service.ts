import { Injectable, signal, computed } from '@angular/core';
import { LocalStorageService } from './local-storage.service';
import { PricingRule, VehicleType } from './models';

@Injectable({ providedIn: 'root' })
export class PricingService {
  private readonly rulesSignal = signal<PricingRule[]>(this.storage.read<PricingRule[]>('app_pricing_rules', []));
  readonly pricingRules = computed(() => this.rulesSignal());

  constructor(private readonly storage: LocalStorageService) {}

  private persist() {
    this.storage.write('app_pricing_rules', this.rulesSignal());
  }

  addRule(rule: PricingRule) {
    this.rulesSignal.set([...this.rulesSignal(), rule]);
    this.persist();
  }

  updateRule(rule: PricingRule) {
    const list = this.rulesSignal().map((item) => (item.id === rule.id ? rule : item));
    this.rulesSignal.set(list);
    this.persist();
  }

  getRule(id?: string) {
    if (!id) {
      return this.rulesSignal()[0] ?? null;
    }
    return this.rulesSignal().find((item) => item.id === id) ?? null;
  }

  estimate(distanceKm: number, vehicle: VehicleType, pricingRuleId?: string) {
    const rule = this.getRule(pricingRuleId);
    if (!rule) {
      return null;
    }
    const rideCost = vehicle.baseFare + vehicle.perKmRate * distanceKm;
    const tax = (rideCost * rule.taxPercent) / 100;
    const total = (rideCost + tax) * rule.surgeMultiplier;
    return {
      distanceKm,
      baseFare: vehicle.baseFare,
      perKmRate: vehicle.perKmRate,
      tax,
      total,
      ruleId: rule.id,
      ruleName: rule.name,
      surgeMultiplier: rule.surgeMultiplier
    };
  }
}
