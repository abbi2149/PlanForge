import type { Minute, MoneyMinor } from '@planforge/model';
import type { LaborCostLine, LaborRate } from './types.js';

export function laborCostLine(rate: LaborRate, regularMinutes: Minute, overtimeMinutes: Minute): LaborCostLine {
  const regularCostMinor = (regularMinutes * rate.regularMinorPerMinute) as MoneyMinor;
  const overtimeCostMinor = (overtimeMinutes * rate.overtimeMinorPerMinute) as MoneyMinor;
  return {
    workerId: rate.workerId,
    regularMinutes,
    overtimeMinutes,
    regularCostMinor,
    overtimeCostMinor,
    totalCostMinor: (regularCostMinor + overtimeCostMinor) as MoneyMinor,
  };
}
