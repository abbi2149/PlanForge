import type { Quantity } from '@planforge/model';
import type { MaterialYieldInput, MaterialYieldResult } from './types.js';

export function materialYield(input: MaterialYieldInput): MaterialYieldResult {
  const accountedQuantity = (input.goodQuantity + input.reworkQuantity + input.scrapQuantity) as Quantity;
  return {
    itemId: input.itemId,
    firstPassBasisPoints: input.inputQuantity === 0 ? 0 : Math.round((input.goodQuantity * 10_000) / input.inputQuantity),
    finalYieldBasisPoints: input.inputQuantity === 0 ? 0 : Math.round(((input.goodQuantity + input.reworkQuantity) * 10_000) / input.inputQuantity),
    scrapBasisPoints: input.inputQuantity === 0 ? 0 : Math.round((input.scrapQuantity * 10_000) / input.inputQuantity),
    accountedQuantity,
  };
}
