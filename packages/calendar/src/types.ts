import type { Minute, TimeRange, WorkCenterId } from '@planforge/model';

export interface ShiftWindow extends TimeRange {
  readonly workCenterId: WorkCenterId;
  readonly capacityUnits: number;
  readonly label: string;
}

export interface CalendarException extends TimeRange {
  readonly workCenterId: WorkCenterId;
  readonly kind: 'closed' | 'reduced';
  readonly capacityUnits?: number;
  readonly reason: string;
}

export interface WorkCalendar {
  readonly horizonStart: Minute;
  readonly horizonEnd: Minute;
  readonly shifts: readonly ShiftWindow[];
  readonly exceptions: readonly CalendarException[];
}

export interface AvailabilitySlice extends TimeRange {
  readonly capacityUnits: number;
  readonly source: 'shift' | 'exception';
}
