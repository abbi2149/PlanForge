import type { ThroughputObservation, ThroughputRate } from './types.js';

export function calculateThroughput(observation: ThroughputObservation): ThroughputRate {
  const minutes = Math.max(0, observation.end - observation.start);
  return {
    workCenterId: observation.workCenterId,
    unitsPerHour: minutes === 0 ? 0 : (observation.totalQuantity * 60) / minutes,
    goodUnitsPerHour: minutes === 0 ? 0 : (observation.goodQuantity * 60) / minutes,
    yieldBasisPoints: observation.totalQuantity === 0 ? 0 : Math.round((observation.goodQuantity * 10_000) / observation.totalQuantity),
  };
}
