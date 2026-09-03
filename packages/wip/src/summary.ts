import type { Minute, Quantity, WorkCenterId } from '@planforge/model';
import type { WipEntry, WipSummary } from './types.js';

export function summarizeWip(entries: readonly WipEntry[], workCenterId: WorkCenterId, now: Minute): WipSummary {
  const relevant = entries.filter((entry) => entry.workCenterId === workCenterId);
  const ages = relevant.map((entry) => Math.max(0, now - entry.enteredMinute));
  return {
    workCenterId,
    orderCount: new Set(relevant.map((entry) => entry.orderId)).size,
    quantity: relevant.reduce((sum, entry) => sum + entry.quantity, 0) as Quantity,
    averageAgeMinutes: ages.length === 0 ? 0 : ages.reduce((a, b) => a + b, 0) / ages.length,
    maximumAgeMinutes: Math.max(0, ...ages) as Minute,
  };
}
