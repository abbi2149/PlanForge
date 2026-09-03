import type { MoneyMinor } from '@planforge/model';
import type { SetupCostRate, SetupCostResult } from './types.js';

export function setupCost(rate: SetupCostRate, minutes: number): SetupCostResult {
  const laborMinor = Math.round(minutes * rate.laborMinorPerMinute) as MoneyMinor;
  const downtimeMinor = Math.round(minutes * rate.downtimeMinorPerMinute) as MoneyMinor;
  return {
    workCenterId: rate.workCenterId,
    minutes,
    laborMinor,
    downtimeMinor,
    consumablesMinor: rate.consumablesMinor,
    totalMinor: (laborMinor + downtimeMinor + rate.consumablesMinor) as MoneyMinor,
  };
}
