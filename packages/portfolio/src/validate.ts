import { failure, success, type ModelResult } from '@planforge/model';
import type { PortfolioCandidate } from './types.js';

export function validatePortfolioCandidates(candidates: readonly PortfolioCandidate[]): ModelResult<readonly PortfolioCandidate[]> {
  const ids = new Set<string>();
  for (const candidate of candidates) {
    if (ids.has(candidate.scenarioId) || !Number.isFinite(candidate.valueScore) || candidate.riskScore < 0 || candidate.costMinor < 0) {
      return failure({ code: 'PORTFOLIO_CANDIDATE', message: `invalid candidate ${candidate.scenarioId}` });
    }
    ids.add(candidate.scenarioId);
  }
  return success([...candidates]);
}
