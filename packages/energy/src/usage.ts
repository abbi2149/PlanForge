import type { ScheduledOperation } from '@planforge/model';
import type { EnergyUsage, EnergyRate, WorkCenterEnergyProfile } from './types.js';
import { splitByRates } from './rates.js';

export function operationEnergy(
  operation: ScheduledOperation,
  profile: WorkCenterEnergyProfile,
  rates: readonly EnergyRate[],
): readonly EnergyUsage[] {
  const slices = splitByRates(operation.startMinute, operation.endMinute, rates);
  return slices.map((rate) => {
    const minutes = rate.end - rate.start;
    const wattMinutes = minutes * profile.runWatts;
    const kwh = wattMinutes / 60_000;
    return {
      workCenterId: operation.workCenterId,
      start: rate.start,
      end: rate.end,
      wattMinutes,
      kwh,
      costMinor: Math.round(kwh * rate.minorPerKwh),
      carbonGrams: Math.round(kwh * rate.carbonGramsPerKwh),
    };
  });
}
