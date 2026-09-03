import { availabilityFor, type WorkCalendar } from '@planforge/calendar';
import { failure, success, type Minute, type ModelResult, type WorkCenterId } from '@planforge/model';
import { addReservation } from './ledger.js';
import type { CapacityLedger, CapacityReservation } from './types.js';

export function canReserve(
  calendar: WorkCalendar,
  ledger: CapacityLedger,
  candidate: CapacityReservation,
): boolean {
  const slices = availabilityFor(calendar, candidate.workCenterId, candidate);
  let cursor = candidate.start;
  for (const slice of slices) {
    if (slice.start > cursor) return false;
    const overlapping = ledger.reservations.filter(
      (entry) => entry.workCenterId === candidate.workCenterId && entry.start < slice.end && slice.start < entry.end,
    );
    const occupied = overlapping.reduce((sum, entry) => sum + entry.units, 0);
    if (occupied + candidate.units > slice.capacityUnits) return false;
    cursor = Math.max(cursor, slice.end) as Minute;
    if (cursor >= candidate.end) return true;
  }
  return cursor >= candidate.end;
}

export function reserveCapacity(
  calendar: WorkCalendar,
  ledger: CapacityLedger,
  candidate: CapacityReservation,
): ModelResult<CapacityLedger> {
  if (candidate.units <= 0 || !Number.isSafeInteger(candidate.units)) {
    return failure({ code: 'CAPACITY_UNITS', message: 'reservation units must be a positive integer' });
  }
  if (candidate.end <= candidate.start) {
    return failure({ code: 'CAPACITY_RANGE', message: 'reservation must have positive duration' });
  }
  if (!canReserve(calendar, ledger, candidate)) {
    return failure({ code: 'CAPACITY_CONFLICT', message: `insufficient capacity on ${candidate.workCenterId}` });
  }
  return success(addReservation(ledger, candidate));
}

export function firstCapacityGap(
  calendar: WorkCalendar,
  ledger: CapacityLedger,
  workCenterId: WorkCenterId,
  earliest: Minute,
  duration: Minute,
  units = 1,
): Minute | null {
  for (let start = earliest as number; start + duration <= calendar.horizonEnd; start += 1) {
    const candidate = { start: start as Minute, end: (start + duration) as Minute, workCenterId, units };
    const slices = availabilityFor(calendar, workCenterId, candidate);
    if (slices.reduce((sum, slice) => sum + (slice.end - slice.start), 0) < duration) continue;
    const occupied = ledger.reservations.filter(
      (entry) => entry.workCenterId === workCenterId && entry.start < candidate.end && candidate.start < entry.end,
    );
    const maxUsed = occupied.reduce((max, entry) => Math.max(max, entry.units), 0);
    if (maxUsed + units <= Math.min(...slices.map((slice) => slice.capacityUnits))) return start as Minute;
  }
  return null;
}
