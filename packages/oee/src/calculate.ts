import type { OeeInput, OeeResult } from './types.js';

export function calculateOee(input: OeeInput): OeeResult {
  const runMinutes = Math.max(0, input.plannedProductionMinutes - input.downtimeMinutes);
  const availability = input.plannedProductionMinutes === 0 ? 0 : Math.round((runMinutes * 10_000) / input.plannedProductionMinutes);
  const performance = runMinutes === 0 ? 0 : Math.min(10_000, Math.round((input.idealCycleMinutes * input.totalCount * 10_000) / runMinutes));
  const quality = input.totalCount === 0 ? 0 : Math.min(10_000, Math.round((input.goodCount * 10_000) / input.totalCount));
  const oee = Math.round((availability * performance * quality) / 100_000_000);
  return {
    workCenterId: input.workCenterId,
    availabilityBasisPoints: availability,
    performanceBasisPoints: performance,
    qualityBasisPoints: quality,
    oeeBasisPoints: oee,
  };
}
