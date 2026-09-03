import { availabilityFor, type WorkCalendar } from '@planforge/calendar';
import type { Minute, WorkCenterId } from '@planforge/model';
import type { CapacityLedger, UtilizationBucket } from './types.js';

export function utilizationForRange(
  calendar: WorkCalendar,
  ledger: CapacityLedger,
  workCenterId: WorkCenterId,
  start: Minute,
  end: Minute,
): UtilizationBucket {
  const availableUnitMinutes = availabilityFor(calendar, workCenterId, { start, end }).reduce(
    (sum, slice) => sum + (slice.end - slice.start) * slice.capacityUnits,
    0,
  );
  const reservedUnitMinutes = ledger.reservations
    .filter((entry) => entry.workCenterId === workCenterId && entry.start < end && start < entry.end)
    .reduce((sum, entry) => {
      const overlapStart = Math.max(start, entry.start);
      const overlapEnd = Math.min(end, entry.end);
      return sum + Math.max(0, overlapEnd - overlapStart) * entry.units;
    }, 0);
  return {
    workCenterId,
    start,
    end,
    reservedUnitMinutes,
    availableUnitMinutes,
    utilizationBasisPoints:
      availableUnitMinutes === 0 ? 0 : Math.min(10_000, Math.round((reservedUnitMinutes * 10_000) / availableUnitMinutes)),
  };
}

export function bottleneckCenters(
  calendar: WorkCalendar,
  ledger: CapacityLedger,
  centers: readonly WorkCenterId[],
  start: Minute,
  end: Minute,
  thresholdBasisPoints = 8_500,
): readonly UtilizationBucket[] {
  return centers
    .map((center) => utilizationForRange(calendar, ledger, center, start, end))
    .filter((bucket) => bucket.utilizationBasisPoints >= thresholdBasisPoints)
    .sort((a, b) => b.utilizationBasisPoints - a.utilizationBasisPoints || a.workCenterId.localeCompare(b.workCenterId));
}
