import { failure, success, type ModelResult } from '@planforge/model';
import type { OrderLineInput } from './types.js';

export function validateOrderInputs(inputs: readonly OrderLineInput[]): ModelResult<readonly OrderLineInput[]> {
  const ids = new Set<string>();
  for (const input of inputs) {
    if (ids.has(input.id)) return failure({ code: 'ORDERS_DUPLICATE', message: `duplicate order ${input.id}` });
    ids.add(input.id);
    if (input.quantity <= 0 || input.dueMinute < input.releaseMinute) {
      return failure({ code: 'ORDERS_WINDOW', message: `invalid order ${input.id}` });
    }
    if (input.priority !== undefined && (!Number.isSafeInteger(input.priority) || input.priority < 0)) {
      return failure({ code: 'ORDERS_PRIORITY', message: `invalid priority for ${input.id}` });
    }
  }
  return success([...inputs]);
}
