import { failure, success, type ModelResult } from '@planforge/model';
import type { InspectionLot, QualityProfile } from './types.js';

export function validateQualityProfile(profile: QualityProfile): ModelResult<QualityProfile> {
  for (const [name, value] of [
    ['expectedYieldBasisPoints', profile.expectedYieldBasisPoints],
    ['inspectionBasisPoints', profile.inspectionBasisPoints],
    ['reworkBasisPoints', profile.reworkBasisPoints],
  ] as const) {
    if (!Number.isInteger(value) || value < 0 || value > 10_000) {
      return failure({ code: 'QUALITY_PROFILE', message: `${name} is outside 0..10000` });
    }
  }
  return success(profile);
}

export function validateInspectionLot(lot: InspectionLot): ModelResult<InspectionLot> {
  if (lot.sampleQuantity > lot.producedQuantity || lot.defects > lot.sampleQuantity) {
    return failure({ code: 'QUALITY_SAMPLE', message: 'inspection quantities are inconsistent' });
  }
  return success(lot);
}
