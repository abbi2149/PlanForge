import type { Quantity } from '@planforge/model';
import type { InspectionLot, QualityOutcome, QualityProfile } from './types.js';

export function evaluateInspection(
  profile: QualityProfile,
  lot: InspectionLot,
  acceptanceDefectBasisPoints: number,
): QualityOutcome {
  const defectBasisPoints = lot.sampleQuantity === 0 ? 0 : Math.round((lot.defects * 10_000) / lot.sampleQuantity);
  const estimatedDefects = Math.ceil((lot.producedQuantity * defectBasisPoints) / 10_000) as Quantity;
  const estimatedReworkQuantity = Math.ceil((estimatedDefects * profile.reworkBasisPoints) / 10_000) as Quantity;
  return {
    accepted: defectBasisPoints <= acceptanceDefectBasisPoints,
    defectBasisPoints,
    estimatedGoodQuantity: Math.max(0, lot.producedQuantity - estimatedDefects) as Quantity,
    estimatedReworkQuantity,
  };
}

export function effectiveYield(quantity: Quantity, profile: QualityProfile): Quantity {
  return Math.floor((quantity * profile.expectedYieldBasisPoints) / 10_000) as Quantity;
}
