import { availabilityFor, type WorkCalendar } from '@planforge/calendar';
import type { Minute, WorkCenterId } from '@planforge/model';
import type { CapacityConflict, CapacityLedger, CapacityReservation } from './types.js';

function activeAt(reservations: readonly CapacityReservation[], minute: Minute): readonly CapacityReservation[] {
  return reservations.filter((entry) => entry.start <= minute && minute < entry.end);
}

export function capacityAt(calendar: WorkCalendar, workCenterId: WorkCenterId, minute: Minute): number {
  const slice = availabilityFor(calendar, workCenterId, { start: minute, end: (minute + 1) as Minute })[0];
  return slice?.capacityUnits ?? 0;
}

export function detectCapacityConflicts(calendar: WorkCalendar, ledger: CapacityLedger): readonly CapacityConflict[] {
  const result: CapacityConflict[] = [];
  const centers = [...new Set(ledger.reservations.map((entry) => entry.workCenterId))].sort();
  for (const center of centers) {
    const reservations = ledger.reservations.filter((entry) => entry.workCenterId === center);
    const points = [...new Set(reservations.flatMap((entry) => [entry.start, entry.end]))].sort((a, b) => a - b);
    for (const point of points.slice(0, -1)) {
      const active = activeAt(reservations, point);
      const requiredUnits = active.reduce((sum, entry) => sum + entry.units, 0);
      const availableUnits = capacityAt(calendar, center, point);
      if (requiredUnits > availableUnits) {
        result.push({ workCenterId: center, atMinute: point, requiredUnits, availableUnits, reservations: active });
      }
    }
  }
  return result;
}
