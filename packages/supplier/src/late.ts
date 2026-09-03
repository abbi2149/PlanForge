import type { SupplierDelivery } from './types.js';

export function lateDeliveries(deliveries: readonly SupplierDelivery[]): readonly SupplierDelivery[] {
  return deliveries
    .filter((entry) => entry.receivedMinute > entry.promisedMinute)
    .sort((a, b) => (b.receivedMinute - b.promisedMinute) - (a.receivedMinute - a.promisedMinute) || a.supplierId.localeCompare(b.supplierId));
}

export function shortDeliveries(deliveries: readonly SupplierDelivery[]): readonly SupplierDelivery[] {
  return deliveries
    .filter((entry) => entry.acceptedQuantity < entry.orderedQuantity)
    .sort((a, b) => (b.orderedQuantity - b.acceptedQuantity) - (a.orderedQuantity - a.acceptedQuantity) || a.supplierId.localeCompare(b.supplierId));
}
