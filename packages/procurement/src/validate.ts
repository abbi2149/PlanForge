import { failure, success, type ModelResult } from '@planforge/model';
import type { SupplierOffer } from './types.js';

export function validateSupplierOffers(offers: readonly SupplierOffer[]): ModelResult<readonly SupplierOffer[]> {
  const keys = new Set<string>();
  for (const offer of offers) {
    const key = `${offer.supplierId}\u0000${offer.itemId}`;
    if (keys.has(key)) return failure({ code: 'PROCUREMENT_DUPLICATE_OFFER', message: `duplicate offer ${key}` });
    keys.add(key);
    if (offer.minimumOrder <= 0 || offer.orderMultiple <= 0 || offer.leadMinutes < 0 || offer.unitCostMinor < 0) {
      return failure({ code: 'PROCUREMENT_OFFER', message: `invalid offer ${key}` });
    }
    if (offer.reliabilityBasisPoints < 0 || offer.reliabilityBasisPoints > 10_000) {
      return failure({ code: 'PROCUREMENT_RELIABILITY', message: `invalid reliability for ${key}` });
    }
  }
  return success([...offers]);
}
