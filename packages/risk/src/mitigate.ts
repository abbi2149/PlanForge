import type { RiskItem } from './types.js';

export function applyMitigation(item: RiskItem, probabilityReductionBasisPoints: number, impactReductionBasisPoints: number): RiskItem {
  const probability = Math.max(0, Math.round((item.probabilityBasisPoints * (10_000 - Math.max(0, probabilityReductionBasisPoints))) / 10_000));
  const impact = Math.max(0, (item.impact * (10_000 - Math.max(0, impactReductionBasisPoints))) / 10_000);
  return { ...item, probabilityBasisPoints: probability, impact };
}
