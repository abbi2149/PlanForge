import type { ProfitabilityInput, ProfitabilityResult } from './types.js';

export function calculateProfitability(input: ProfitabilityInput): ProfitabilityResult {
  const cost = input.materialMinor + input.conversionMinor + input.logisticsMinor;
  const contributionMinor = input.revenueMinor - cost;
  return {
    itemId: input.itemId,
    contributionMinor,
    contributionPerUnitMinor: input.quantity === 0 ? 0 : contributionMinor / input.quantity,
    marginBasisPoints: input.revenueMinor === 0 ? 0 : Math.round((contributionMinor * 10_000) / input.revenueMinor),
  };
}
