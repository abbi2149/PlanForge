import { intersectRanges, type Minute, type TimeRange, type WorkCenterId } from '@planforge/model';
import type { AvailabilitySlice, WorkCalendar } from './types.js';

export function availabilityFor(
  calendar: WorkCalendar,
  workCenterId: WorkCenterId,
  range: TimeRange,
): readonly AvailabilitySlice[] {
  const result: AvailabilitySlice[] = [];
  for (const shift of calendar.shifts) {
    if (shift.workCenterId !== workCenterId) continue;
    const intersection = intersectRanges(shift, range);
    if (!intersection) continue;
    let fragments: AvailabilitySlice[] = [{ ...intersection, capacityUnits: shift.capacityUnits, source: 'shift' }];
    for (const exception of calendar.exceptions) {
      if (exception.workCenterId !== workCenterId) continue;
      const next: AvailabilitySlice[] = [];
      for (const fragment of fragments) {
        const overlap = intersectRanges(fragment, exception);
        if (!overlap) {
          next.push(fragment);
          continue;
        }
        if (fragment.start < overlap.start) next.push({ ...fragment, end: overlap.start });
        if (exception.kind === 'reduced') {
          next.push({
            start: overlap.start,
            end: overlap.end,
            capacityUnits: Math.min(fragment.capacityUnits, exception.capacityUnits ?? fragment.capacityUnits),
            source: 'exception',
          });
        }
        if (overlap.end < fragment.end) next.push({ ...fragment, start: overlap.end });
      }
      fragments = next;
    }
    result.push(...fragments);
  }
  return result.sort((a, b) => a.start - b.start || a.end - b.end);
}

export function nextAvailableMinute(
  calendar: WorkCalendar,
  workCenterId: WorkCenterId,
  atOrAfter: Minute,
): Minute | null {
  const slices = availabilityFor(calendar, workCenterId, { start: atOrAfter, end: calendar.horizonEnd });
  return slices[0]?.start ?? null;
}
