import { failure, success, type ModelResult } from '@planforge/model';
import type { BottleneckObservation } from './types.js';

export function validateBottleneckObservations(observations: readonly BottleneckObservation[]): ModelResult<readonly BottleneckObservation[]> {
  const centers = new Set<string>();
  for (const entry of observations) {
    if (centers.has(entry.workCenterId) || entry.availableMinutes < 0 || entry.requiredMinutes < 0 || entry.queueMinutes < 0) {
      return failure({ code: 'BOTTLENECK_OBSERVATION', message: `invalid observation ${entry.workCenterId}` });
    }
    centers.add(entry.workCenterId);
  }
  return success([...observations]);
}
