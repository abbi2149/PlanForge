import { failure, success, type ModelResult } from '@planforge/model';
import type { MaterialYieldInput } from './types.js';

export function validateMaterialYield(input: MaterialYieldInput): ModelResult<MaterialYieldInput> {
  if (input.inputQuantity < 0 || input.goodQuantity < 0 || input.reworkQuantity < 0 || input.scrapQuantity < 0) {
    return failure({ code: 'MATERIAL_YIELD', message: `invalid material yield ${input.itemId}` });
  }
  if (input.goodQuantity + input.reworkQuantity + input.scrapQuantity > input.inputQuantity) {
    return failure({ code: 'MATERIAL_YIELD_BALANCE', message: `material yield exceeds input ${input.itemId}` });
  }
  return success(input);
}
