import {
  success,
  type Minute,
  type ModelResult,
  type OrderId,
  type WorkCenterId,
} from '@planforge/model';
import {
  addCauseMinutes,
  causeMinutesOf,
  emptyCauseMinutes,
  attributeOrderDelays,
} from './explain.js';
import type {
  BlockingOrder,
  CriticalPathInput,
  CriticalPathSummary,
  OrderCriticalPath,
  WorkCenterDelay,
} from './types.js';
import { validateCriticalPathInput } from './validate.js';

export function workCenterDelays(paths: readonly OrderCriticalPath[]): readonly WorkCenterDelay[] {
  const segments = paths.flatMap((path) =>
    path.segments.map((segment) => ({ orderId: path.orderId, segment })),
  );
  const centers = [
    ...new Set(segments.map((entry) => entry.segment.workCenterId)),
  ].sort() as WorkCenterId[];
  return centers
    .map((workCenterId) => {
      const owned = segments.filter((entry) => entry.segment.workCenterId === workCenterId);
      const minutesByCause = causeMinutesOf(owned.map((entry) => entry.segment));
      return {
        workCenterId,
        minutesByCause,
        waitMinutes: (minutesByCause['calendar-closed'] +
          minutesByCause['resource-contention'] +
          minutesByCause['idle-wait']) as Minute,
        affectedOrders: [...new Set(owned.map((entry) => entry.orderId))].sort(),
      };
    })
    .sort((a, b) => b.waitMinutes - a.waitMinutes || a.workCenterId.localeCompare(b.workCenterId));
}

/**
 * Ranks the orders whose scheduled work held a work center while another order
 * waited on its critical chain. A blocking order is not necessarily at fault --
 * it is where a planner can look first to shorten someone else's flow time.
 */
export function blockingOrders(paths: readonly OrderCriticalPath[]): readonly BlockingOrder[] {
  const minutes = new Map<string, number>();
  const blocked = new Map<string, Set<string>>();
  for (const path of paths) {
    for (const segment of path.segments) {
      for (const orderId of segment.blockingOrders) {
        minutes.set(orderId, (minutes.get(orderId) ?? 0) + segment.minutes);
        const victims = blocked.get(orderId) ?? new Set<string>();
        victims.add(path.orderId);
        blocked.set(orderId, victims);
      }
    }
  }
  return [...minutes.entries()]
    .map(([orderId, blockedMinutes]) => ({
      orderId: orderId as OrderId,
      blockedMinutes: blockedMinutes as Minute,
      blockedOrders: [...(blocked.get(orderId) ?? new Set<string>())].sort() as OrderId[],
    }))
    .sort((a, b) => b.blockedMinutes - a.blockedMinutes || a.orderId.localeCompare(b.orderId));
}

/**
 * Explains the whole plan: per-order attribution plus the work centres and
 * orders that absorbed the most waiting time.
 */
export function planCriticalPaths(input: CriticalPathInput): ModelResult<CriticalPathSummary> {
  const valid = validateCriticalPathInput(input);
  if (!valid.ok) return valid;
  const paths = attributeOrderDelays(input);
  const minutesByCause = paths.reduce(
    (total, path) => addCauseMinutes(total, path.minutesByCause),
    emptyCauseMinutes(),
  );
  const totalMinutes =
    minutesByCause.processing +
    minutesByCause['calendar-closed'] +
    minutesByCause['resource-contention'] +
    minutesByCause['idle-wait'];
  return success({
    planDigest: input.plan.digest,
    orders: paths,
    minutesByCause,
    waitShareBasisPoints:
      totalMinutes === 0
        ? 0
        : Math.round(((totalMinutes - minutesByCause.processing) * 10_000) / totalMinutes),
    workCenters: workCenterDelays(paths),
    blockingOrders: blockingOrders(paths),
    lateOrders: paths
      .filter((path) => path.tardinessMinutes > 0)
      .map((path) => path.orderId)
      .sort(),
  });
}
