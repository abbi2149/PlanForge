import type { OeeResult } from './types.js';

export interface OeeLosses {
  readonly availabilityLossBasisPoints: number;
  readonly performanceLossBasisPoints: number;
  readonly qualityLossBasisPoints: number;
}

export function oeeLosses(result: OeeResult): OeeLosses {
  return {
    availabilityLossBasisPoints: 10_000 - result.availabilityBasisPoints,
    performanceLossBasisPoints: 10_000 - result.performanceBasisPoints,
    qualityLossBasisPoints: 10_000 - result.qualityBasisPoints,
  };
}
