import type { Minute, ScheduledOperation } from '@planforge/model';
import type { DelayRule } from './types.js';

export function deterministicDelay(
  operation: ScheduledOperation,
  ordinalAtCenter: number,
  rules: readonly DelayRule[],
): Minute {
  return rules.reduce((total, rule) => {
    if (rule.workCenterId !== operation.workCenterId) return total;
    if (rule.everyNthOperation <= 0) return total;
    return ordinalAtCenter % rule.everyNthOperation === 0
      ? ((total + rule.delayMinutes) as Minute)
      : total;
  }, 0 as Minute);
}
