import type { ProfitabilityResult } from './types.js';

export function rankProfitability(results: readonly ProfitabilityResult[]): readonly ProfitabilityResult[] {
  return [...results].sort((a, b) => b.contributionMinor - a.contributionMinor || a.itemId.localeCompare(b.itemId));
}

export function negativeContribution(results: readonly ProfitabilityResult[]): readonly ProfitabilityResult[] {
  return results.filter((result) => result.contributionMinor < 0).sort((a, b) => a.contributionMinor - b.contributionMinor);
}
