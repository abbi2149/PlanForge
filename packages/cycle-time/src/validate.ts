import { failure, success, type ModelResult } from '@planforge/model';
import type { CycleObservation } from './types.js';

export function validateCycleObservations(observations: readonly CycleObservation[]): ModelResult<readonly CycleObservation[]> {
  for (const entry of observations) {
    if (entry.cycleMinutes <= 0 || entry.targetMinutes <= 0 || !Number.isSafeInteger(entry.sequence)) {
      return failure({ code: 'CYCLE_OBSERVATION', message: `invalid cycle observation ${entry.workCenterId}` });
    }
  }
  return success([...observations]);
}
