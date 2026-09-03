import { scoreRisks } from './score.js';
import type { RiskItem, RiskPortfolio } from './types.js';

export function buildRiskPortfolio(items: readonly RiskItem[]): RiskPortfolio {
  const scores = scoreRisks(items);
  const categories = new Map<string, number>();
  for (const score of scores) categories.set(score.category, (categories.get(score.category) ?? 0) + score.exposure);
  const highestCategory = [...categories.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] ?? null;
  return { scores, totalExposure: scores.reduce((sum, score) => sum + score.exposure, 0), highestCategory };
}
