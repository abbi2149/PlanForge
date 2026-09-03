import type { TimeRange, WorkCenterId } from '@planforge/model';

export interface Skill {
  readonly id: string;
  readonly description: string;
}

export interface Worker {
  readonly id: string;
  readonly name: string;
  readonly skills: readonly string[];
  readonly efficiencyBasisPoints: number;
}

export interface WorkerAvailability extends TimeRange {
  readonly workerId: string;
}

export interface StaffingRequirement extends TimeRange {
  readonly workCenterId: WorkCenterId;
  readonly skillId: string;
  readonly headcount: number;
}

export interface StaffingAssignment extends TimeRange {
  readonly workerId: string;
  readonly workCenterId: WorkCenterId;
  readonly skillId: string;
}

export interface StaffingGap extends TimeRange {
  readonly workCenterId: WorkCenterId;
  readonly skillId: string;
  readonly required: number;
  readonly assigned: number;
}
