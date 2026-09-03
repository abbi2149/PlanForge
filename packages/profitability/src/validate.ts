import { failure, success, type ModelResult } from '@planforge/model';
import type { ProfitabilityInput } from './types.js';

export function validateProfitability(input: ProfitabilityInput): ModelResult<ProfitabilityInput> {
  if (input.quantity < 0 || input.revenueMinor < 0 || input.materialMinor < 0 || input.conversionMinor < 0 || input.logisticsMinor < 0) {
    return failure({ code: 'PROFITABILITY_INPUT', message: `invalid profitability input ${input.itemId}` });
  }
  return success(input);
}
