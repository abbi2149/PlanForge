import type { FulfillmentRecord } from './types.js';

export function serviceBreaches(records: readonly FulfillmentRecord[]): readonly FulfillmentRecord[] {
  return records
    .filter((record) => record.completedMinute > record.promisedMinute || record.shippedQuantity < record.requestedQuantity)
    .sort((a, b) => (b.completedMinute - b.promisedMinute) - (a.completedMinute - a.promisedMinute) || a.orderId.localeCompare(b.orderId));
}
