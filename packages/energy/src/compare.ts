import type { EnergySummary } from './summary.js';

export interface EnergyDelta {
  readonly kwh: number;
  readonly costMinor: number;
  readonly carbonGrams: number;
}

export function compareEnergy(left: EnergySummary, right: EnergySummary): EnergyDelta {
  return {
    kwh: right.kwh - left.kwh,
    costMinor: right.costMinor - left.costMinor,
    carbonGrams: right.carbonGrams - left.carbonGrams,
  };
}
