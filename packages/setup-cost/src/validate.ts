import { failure, success, type ModelResult } from '@planforge/model';
import type { SetupCostRate } from './types.js';

export function validateSetupCostRate(rate: SetupCostRate): ModelResult<SetupCostRate> {
  if (rate.laborMinorPerMinute < 0 || rate.downtimeMinorPerMinute < 0 || rate.consumablesMinor < 0) {
    return failure({ code: 'SETUP_COST_RATE', message: `invalid setup cost rate ${rate.workCenterId}` });
  }
  return success(rate);
}
