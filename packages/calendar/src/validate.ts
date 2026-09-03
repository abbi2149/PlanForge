import { failure, rangesOverlap, success, type ModelResult } from '@planforge/model';
import type { WorkCalendar } from './types.js';

export function validateCalendar(calendar: WorkCalendar): ModelResult<WorkCalendar> {
  if (calendar.horizonEnd <= calendar.horizonStart) {
    return failure({ code: 'CALENDAR_HORIZON', message: 'calendar horizon must be positive' });
  }
  for (const shift of calendar.shifts) {
    if (shift.end <= shift.start || shift.capacityUnits <= 0 || !Number.isSafeInteger(shift.capacityUnits)) {
      return failure({ code: 'CALENDAR_SHIFT', message: `invalid shift ${shift.label}` });
    }
    if (shift.start < calendar.horizonStart || shift.end > calendar.horizonEnd) {
      return failure({ code: 'CALENDAR_OUTSIDE_HORIZON', message: `shift ${shift.label} is outside the horizon` });
    }
  }
  for (const exception of calendar.exceptions) {
    if (exception.end <= exception.start) {
      return failure({ code: 'CALENDAR_EXCEPTION', message: `invalid exception ${exception.reason}` });
    }
    if (exception.kind === 'reduced' && (exception.capacityUnits ?? 0) <= 0) {
      return failure({ code: 'CALENDAR_REDUCED_CAPACITY', message: `reduced exception ${exception.reason} needs capacity` });
    }
  }
  const byCenter = new Map<string, typeof calendar.shifts>();
  for (const shift of calendar.shifts) {
    const group = byCenter.get(shift.workCenterId) ?? [];
    byCenter.set(shift.workCenterId, [...group, shift]);
  }
  for (const [center, shifts] of byCenter) {
    const sorted = [...shifts].sort((a, b) => a.start - b.start || a.end - b.end);
    for (let index = 1; index < sorted.length; index += 1) {
      if (rangesOverlap(sorted[index - 1]!, sorted[index]!)) {
        return failure({ code: 'CALENDAR_OVERLAP', message: `work center ${center} has overlapping shifts` });
      }
    }
  }
  return success(calendar);
}
