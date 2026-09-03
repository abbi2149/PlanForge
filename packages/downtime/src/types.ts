import type { Minute, WorkCenterId } from '@planforge/model';

export interface DowntimeEvent {
  readonly id: string;
  readonly workCenterId: WorkCenterId;
  readonly start: Minute;
  readonly end: Minute;
  readonly category: 'planned' | 'breakdown' | 'changeover' | 'quality' | 'material' | 'staffing';
  readonly reason: string;
}

export interface DowntimeSummary {
  readonly workCenterId: WorkCenterId;
  readonly totalMinutes: Minute;
  readonly eventCount: number;
  readonly byCategory: Readonly<Record<string, Minute>>;
}
