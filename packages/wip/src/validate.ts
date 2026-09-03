import { failure, success, type ModelResult } from '@planforge/model';
import type { WipEntry } from './types.js';

export function validateWip(entries: readonly WipEntry[]): ModelResult<readonly WipEntry[]> {
  for (const entry of entries) {
    if (entry.orderId.length === 0 || entry.quantity < 0 || entry.enteredMinute < 0) {
      return failure({ code: 'WIP_ENTRY', message: `invalid WIP entry ${entry.orderId}` });
    }
  }
  return success([...entries]);
}
