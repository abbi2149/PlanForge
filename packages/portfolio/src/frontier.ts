import type { PortfolioCandidate } from './types.js';

export function portfolioFrontier(candidates: readonly PortfolioCandidate[]): readonly PortfolioCandidate[] {
  return candidates
    .filter((candidate) => !candidates.some((other) =>
      other !== candidate &&
      other.valueScore >= candidate.valueScore &&
      other.riskScore <= candidate.riskScore &&
      other.costMinor <= candidate.costMinor &&
      (other.valueScore > candidate.valueScore || other.riskScore < candidate.riskScore || other.costMinor < candidate.costMinor),
    ))
    .sort((a, b) => b.valueScore - a.valueScore || a.riskScore - b.riskScore || a.scenarioId.localeCompare(b.scenarioId));
}
