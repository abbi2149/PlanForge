import type { RiskItem, RiskScore } from './types.js';

export function scoreRisks(items: readonly RiskItem[]): readonly RiskScore[] {
  return [...items]
    .map((item) => ({ id: item.id, category: item.category, exposure: (item.probabilityBasisPoints * item.impact) / 10_000, rank: 0 }))
    .sort((a, b) => b.exposure - a.exposure || a.id.localeCompare(b.id))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));
}
