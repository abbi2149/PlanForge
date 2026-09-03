import type { Minute, WorkCenterId } from '@planforge/model';
import type { ReworkPlanLine } from './types.js';

export function reworkLoad(plan: readonly ReworkPlanLine[], workCenterId: WorkCenterId): Minute {
  return plan.filter((entry) => entry.workCenterId === workCenterId).reduce((sum, entry) => sum + (entry.end - entry.start), 0) as Minute;
}
