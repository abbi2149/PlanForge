import { failure, success, type ModelResult } from '@planforge/model';
import type { ThroughputObservation } from './types.js';

export function validateThroughput(observations: readonly ThroughputObservation[]): ModelResult<readonly ThroughputObservation[]> {
  for (const observation of observations) {
    if (observation.end <= observation.start || observation.goodQuantity < 0 || observation.totalQuantity < observation.goodQuantity) {
      return failure({ code: 'THROUGHPUT_OBSERVATION', message: `invalid observation ${observation.workCenterId}` });
    }
  }
  return success([...observations]);
}
