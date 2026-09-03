import { scoreSupplier } from './score.js';
import type { SupplierDelivery, SupplierQualification } from './types.js';

export function qualifiedSupplier(
  qualification: SupplierQualification,
  deliveries: readonly SupplierDelivery[],
): boolean {
  const score = scoreSupplier(qualification.supplierId, deliveries);
  return score.deliveryCount > 0 &&
    score.onTimeBasisPoints >= qualification.minimumOnTimeBasisPoints &&
    score.fillRateBasisPoints >= qualification.minimumFillRateBasisPoints;
}

export function qualifiedSuppliers(
  qualifications: readonly SupplierQualification[],
  deliveries: readonly SupplierDelivery[],
): readonly string[] {
  return qualifications.filter((entry) => qualifiedSupplier(entry, deliveries)).map((entry) => entry.supplierId).sort();
}
