import type { SupplierOffer } from './types.js';

export function landedScore(offer: SupplierOffer, reliabilityPenaltyMinor = 1_000): number {
  const reliabilityGap = Math.max(0, 10_000 - offer.reliabilityBasisPoints);
  return offer.unitCostMinor + Math.round((reliabilityGap * reliabilityPenaltyMinor) / 10_000);
}

export function bestOffer(offers: readonly SupplierOffer[]): SupplierOffer | null {
  return [...offers].sort((a, b) =>
    landedScore(a) - landedScore(b) ||
    a.leadMinutes - b.leadMinutes ||
    b.reliabilityBasisPoints - a.reliabilityBasisPoints ||
    a.supplierId.localeCompare(b.supplierId),
  )[0] ?? null;
}
