import { failure, success, type ModelResult } from '@planforge/model';
import type { OrderMixEntry } from './types.js';

export function validateOrderMix(entries: readonly OrderMixEntry[]): ModelResult<readonly OrderMixEntry[]> {
  for (const entry of entries) {
    if (entry.quantity < 0) return failure({ code: 'ORDER_MIX', message: `invalid order mix ${entry.itemId}` });
  }
  return success([...entries]);
}
