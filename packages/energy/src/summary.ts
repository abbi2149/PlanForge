import type { EnergyUsage } from './types.js';

export interface EnergySummary {
  readonly kwh: number;
  readonly costMinor: number;
  readonly carbonGrams: number;
  readonly byWorkCenterKwh: Readonly<Record<string, number>>;
}

export function summarizeEnergy(usages: readonly EnergyUsage[]): EnergySummary {
  const byCenter: Record<string, number> = {};
  for (const usage of usages) byCenter[usage.workCenterId] = (byCenter[usage.workCenterId] ?? 0) + usage.kwh;
  return {
    kwh: usages.reduce((sum, usage) => sum + usage.kwh, 0),
    costMinor: usages.reduce((sum, usage) => sum + usage.costMinor, 0),
    carbonGrams: usages.reduce((sum, usage) => sum + usage.carbonGrams, 0),
    byWorkCenterKwh: Object.fromEntries(Object.entries(byCenter).sort(([a], [b]) => a.localeCompare(b))),
  };
}
