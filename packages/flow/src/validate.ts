import { failure, success, type ModelResult } from '@planforge/model';
import type { FlowObservation } from './types.js';

export function validateFlowObservations(observations: readonly FlowObservation[]): ModelResult<readonly FlowObservation[]> {
  for (const observation of observations) {
    if (observation.orderId.length === 0 || observation.startMinute < observation.releaseMinute || observation.completionMinute < observation.startMinute || observation.quantity < 0) {
      return failure({ code: 'FLOW_OBSERVATION', message: `invalid flow observation ${observation.orderId}` });
    }
  }
  return success([...observations]);
}
