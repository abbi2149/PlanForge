import type { Minute } from '@planforge/model';
import type { PromiseQuote } from './types.js';

export function promiseQuote(
  orderId: string,
  requestedMinute: Minute,
  estimatedMinute: Minute,
  scheduleSlackMinutes: Minute,
): PromiseQuote {
  const quotedMinute = Math.max(requestedMinute, estimatedMinute) as Minute;
  const lateness = Math.max(0, quotedMinute - requestedMinute);
  const confidence = Math.max(0, Math.min(10_000, 10_000 - Math.round((lateness * 10_000) / Math.max(1, scheduleSlackMinutes + lateness))));
  return {
    orderId,
    requestedMinute,
    quotedMinute,
    confidenceBasisPoints: confidence,
    reason: quotedMinute === requestedMinute ? 'requested-date-feasible' : 'capacity-adjusted',
  };
}
