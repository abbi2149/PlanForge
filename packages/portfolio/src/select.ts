import type { PortfolioCandidate, PortfolioSelection } from './types.js';

export function selectPortfolio(
  candidates: readonly PortfolioCandidate[],
  budgetMinor: number,
  maximumRisk: number,
): PortfolioSelection {
  const sorted = [...candidates].sort((a, b) => {
    const aRatio = a.costMinor <= 0 ? Number.POSITIVE_INFINITY : a.valueScore / a.costMinor;
    const bRatio = b.costMinor <= 0 ? Number.POSITIVE_INFINITY : b.valueScore / b.costMinor;
    return bRatio - aRatio || a.riskScore - b.riskScore || a.scenarioId.localeCompare(b.scenarioId);
  });
  const selected: PortfolioCandidate[] = [];
  let cost = 0;
  let risk = 0;
  for (const candidate of sorted) {
    if (cost + candidate.costMinor > budgetMinor || risk + candidate.riskScore > maximumRisk) continue;
    selected.push(candidate);
    cost += candidate.costMinor;
    risk += candidate.riskScore;
  }
  return {
    selected,
    totalValue: selected.reduce((sum, candidate) => sum + candidate.valueScore, 0),
    totalRisk: risk,
    totalCostMinor: cost,
  };
}
