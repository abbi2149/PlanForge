import type { ThroughputObservation, ThroughputRate } from './types.js';
import { calculateThroughput } from './calculate.js';

export function aggregateThroughput(observations: readonly ThroughputObservation[]): readonly ThroughputRate[] {
  const centers = [...new Set(observations.map((entry) => entry.workCenterId))].sort();
  return centers.map((workCenterId) => {
    const entries = observations.filter((entry) => entry.workCenterId === workCenterId);
    const start = Math.min(...entries.map((entry) => entry.start));
    const end = Math.max(...entries.map((entry) => entry.end));
    const goodQuantity = entries.reduce((sum, entry) => sum + entry.goodQuantity, 0) as ThroughputObservation['goodQuantity'];
    const totalQuantity = entries.reduce((sum, entry) => sum + entry.totalQuantity, 0) as ThroughputObservation['totalQuantity'];
    return calculateThroughput({ workCenterId, start: start as ThroughputObservation['start'], end: end as ThroughputObservation['end'], goodQuantity, totalQuantity });
  });
}
