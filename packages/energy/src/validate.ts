import { failure, success, type ModelResult } from '@planforge/model';
import type { EnergyRate, WorkCenterEnergyProfile } from './types.js';

export function validateEnergy(rates: readonly EnergyRate[], profiles: readonly WorkCenterEnergyProfile[]): ModelResult<true> {
  for (const rate of rates) {
    if (rate.end <= rate.start || rate.minorPerKwh < 0 || rate.carbonGramsPerKwh < 0) {
      return failure({ code: 'ENERGY_RATE', message: 'invalid energy rate' });
    }
  }
  const centers = new Set<string>();
  for (const profile of profiles) {
    if (centers.has(profile.workCenterId) || profile.idleWatts < 0 || profile.runWatts < 0 || profile.setupWatts < 0) {
      return failure({ code: 'ENERGY_PROFILE', message: `invalid energy profile ${profile.workCenterId}` });
    }
    centers.add(profile.workCenterId);
  }
  return success(true);
}
