import type { MaterialYieldInput } from './types.js';

export function unaccountedQuantity(input: MaterialYieldInput): number {
  return input.inputQuantity - input.goodQuantity - input.reworkQuantity - input.scrapQuantity;
}

export function yieldLossQuantity(input: MaterialYieldInput): number {
  return Math.max(0, input.inputQuantity - input.goodQuantity - input.reworkQuantity);
}
