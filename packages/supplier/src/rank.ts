import { scoreSupplier } from './score.js';
import type { SupplierDelivery, SupplierScorecard } from './types.js';

export function rankSuppliers(deliveries: readonly SupplierDelivery[]): readonly SupplierScorecard[] {
  const suppliers = [...new Set(deliveries.map((entry) => entry.supplierId))].sort();
  return suppliers
    .map((supplierId) => scoreSupplier(supplierId, deliveries))
    .sort((a, b) =>
      b.onTimeBasisPoints - a.onTimeBasisPoints ||
      b.fillRateBasisPoints - a.fillRateBasisPoints ||
      a.averageDelayMinutes - b.averageDelayMinutes ||
      a.supplierId.localeCompare(b.supplierId),
    );
}
