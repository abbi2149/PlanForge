import { mergeRanges, type Minute, type TimeRange } from '@planforge/model';
import type { CalendarException, ShiftWindow, WorkCalendar } from './types.js';

const shiftKey = (shift: ShiftWindow): string => `${shift.workCenterId}\u0000${shift.start}\u0000${shift.end}\u0000${shift.label}`;
const exceptionKey = (entry: CalendarException): string => `${entry.workCenterId}\u0000${entry.start}\u0000${entry.end}\u0000${entry.kind}`;

export function normalizeCalendar(calendar: WorkCalendar): WorkCalendar {
  return {
    horizonStart: calendar.horizonStart,
    horizonEnd: calendar.horizonEnd,
    shifts: [...calendar.shifts].sort((a, b) => shiftKey(a).localeCompare(shiftKey(b))),
    exceptions: [...calendar.exceptions].sort((a, b) => exceptionKey(a).localeCompare(exceptionKey(b))),
  };
}

export function coveredRanges(calendar: WorkCalendar): readonly TimeRange[] {
  return mergeRanges(calendar.shifts.map((shift) => ({ start: shift.start, end: shift.end })));
}

export function clampRange(range: TimeRange, start: Minute, end: Minute): TimeRange | null {
  const nextStart = Math.max(range.start, start) as Minute;
  const nextEnd = Math.min(range.end, end) as Minute;
  return nextEnd > nextStart ? { start: nextStart, end: nextEnd } : null;
}
