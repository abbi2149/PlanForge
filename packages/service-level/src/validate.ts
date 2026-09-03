import { failure, success, type ModelResult } from '@planforge/model';
import type { FulfillmentRecord } from './types.js';

export function validateFulfillment(records: readonly FulfillmentRecord[]): ModelResult<readonly FulfillmentRecord[]> {
  const ids = new Set<string>();
  for (const record of records) {
    if (record.orderId.length === 0 || ids.has(record.orderId) || record.requestedQuantity < 0 || record.shippedQuantity < 0) {
      return failure({ code: 'SERVICE_LEVEL_RECORD', message: `invalid fulfillment ${record.orderId}` });
    }
    ids.add(record.orderId);
  }
  return success([...records]);
}
