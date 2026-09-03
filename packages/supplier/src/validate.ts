import { failure, success, type ModelResult } from '@planforge/model';
import type { SupplierDelivery } from './types.js';

export function validateDeliveries(deliveries: readonly SupplierDelivery[]): ModelResult<readonly SupplierDelivery[]> {
  for (const entry of deliveries) {
    if (entry.supplierId.length === 0 || entry.orderedQuantity <= 0 || entry.acceptedQuantity < 0 || entry.acceptedQuantity > entry.orderedQuantity) {
      return failure({ code: 'SUPPLIER_DELIVERY', message: `invalid delivery from ${entry.supplierId}` });
    }
    if (entry.promisedMinute < 0 || entry.receivedMinute < 0) {
      return failure({ code: 'SUPPLIER_TIME', message: `delivery from ${entry.supplierId} has invalid timing` });
    }
  }
  return success([...deliveries]);
}
