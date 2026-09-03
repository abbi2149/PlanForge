import { failure, success, type ModelResult } from '@planforge/model';
import type { LaborRate } from './types.js';

export function validateLaborRates(rates: readonly LaborRate[]): ModelResult<readonly LaborRate[]> {
  const workers = new Set<string>();
  for (const rate of rates) {
    if (rate.workerId.length === 0 || workers.has(rate.workerId) || rate.regularMinorPerMinute < 0 || rate.overtimeMinorPerMinute < rate.regularMinorPerMinute) {
      return failure({ code: 'LABOR_RATE', message: `invalid labor rate ${rate.workerId}` });
    }
    workers.add(rate.workerId);
  }
  return success([...rates]);
}
