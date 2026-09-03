import type { Minute, WorkCenterId } from '@planforge/model';
import { availabilityFor } from './availability.js';
import type { WorkCalendar } from './types.js';

export interface CalendarAllocation {
  readonly start: Minute;
  readonly end: Minute;
  readonly workCenterId: WorkCenterId;
  readonly requiredUnits: number;
}

export function allocateCalendarMinutes(
  calendar: WorkCalendar,
  workCenterId: WorkCenterId,
  earliest: Minute,
  duration: Minute,
  requiredUnits = 1,
): CalendarAllocation | null {
  if (duration <= 0) return { start: earliest, end: earliest, workCenterId, requiredUnits };
  const slices = availabilityFor(calendar, workCenterId, { start: earliest, end: calendar.horizonEnd });
  let remaining = duration;
  let start: Minute | null = null;
  let cursor = earliest;
  for (const slice of slices) {
    if (slice.capacityUnits < requiredUnits) continue;
    if (start === null) start = Math.max(cursor, slice.start) as Minute;
    const usableStart = Math.max(cursor, slice.start) as Minute;
    if (usableStart >= slice.end) continue;
    const available = slice.end - usableStart;
    if (available >= remaining) {
      return {
        start,
        end: (usableStart + remaining) as Minute,
        workCenterId,
        requiredUnits,
      };
    }
    remaining = (remaining - available) as Minute;
    cursor = slice.end;
  }
  return null;
}
