import type { SupplierDelivery, SupplierScorecard } from './types.js';

export function scoreSupplier(supplierId: string, deliveries: readonly SupplierDelivery[]): SupplierScorecard {
  const entries = deliveries.filter((delivery) => delivery.supplierId === supplierId);
  if (entries.length === 0) {
    return { supplierId, deliveryCount: 0, onTimeBasisPoints: 0, fillRateBasisPoints: 0, averageDelayMinutes: 0 };
  }
  const onTime = entries.filter((entry) => entry.receivedMinute <= entry.promisedMinute).length;
  const ordered = entries.reduce((sum, entry) => sum + entry.orderedQuantity, 0);
  const accepted = entries.reduce((sum, entry) => sum + entry.acceptedQuantity, 0);
  const delay = entries.reduce((sum, entry) => sum + Math.max(0, entry.receivedMinute - entry.promisedMinute), 0);
  return {
    supplierId,
    deliveryCount: entries.length,
    onTimeBasisPoints: Math.round((onTime * 10_000) / entries.length),
    fillRateBasisPoints: ordered === 0 ? 0 : Math.min(10_000, Math.round((accepted * 10_000) / ordered)),
    averageDelayMinutes: delay / entries.length,
  };
}
