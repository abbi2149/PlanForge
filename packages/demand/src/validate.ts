import { failure, success, type ModelResult } from '@planforge/model';
import type { DemandSignal } from './types.js';

export function validateDemandSignals(signals: readonly DemandSignal[]): ModelResult<readonly DemandSignal[]> {
  for (const signal of signals) {
    if (signal.quantity < 0 || signal.minute < 0 || signal.reference.length === 0) {
      return failure({ code: 'DEMAND_SIGNAL', message: `invalid demand signal ${signal.reference}` });
    }
  }
  return success([...signals]);
}
