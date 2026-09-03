import { failure, success, type ModelResult } from '@planforge/model';
import type { OeeInput } from './types.js';

export function validateOeeInput(input: OeeInput): ModelResult<OeeInput> {
  if (input.plannedProductionMinutes <= 0 || input.downtimeMinutes < 0 || input.downtimeMinutes > input.plannedProductionMinutes) {
    return failure({ code: 'OEE_TIME', message: `invalid time values for ${input.workCenterId}` });
  }
  if (!(input.idealCycleMinutes > 0) || input.totalCount < 0 || input.goodCount < 0 || input.goodCount > input.totalCount) {
    return failure({ code: 'OEE_COUNT', message: `invalid production values for ${input.workCenterId}` });
  }
  return success(input);
}
