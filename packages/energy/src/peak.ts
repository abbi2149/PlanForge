import type { Minute } from '@planforge/model';
import type { EnergyUsage } from './types.js';

export interface PeakDemand {
  readonly minute: Minute;
  readonly watts: number;
}

export function peakDemand(usages: readonly EnergyUsage[]): PeakDemand {
  const points = [...new Set(usages.flatMap((usage) => [usage.start, usage.end]))].sort((a, b) => a - b);
  let best: PeakDemand = { minute: 0 as Minute, watts: 0 };
  for (const point of points.slice(0, -1)) {
    const watts = usages
      .filter((usage) => usage.start <= point && point < usage.end)
      .reduce((sum, usage) => sum + (usage.wattMinutes / Math.max(1, usage.end - usage.start)), 0);
    if (watts > best.watts) best = { minute: point, watts };
  }
  return best;
}
