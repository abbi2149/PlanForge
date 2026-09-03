import type { Minute, WorkCenterId } from '@planforge/model';

export interface MachineHealthObservation {
  readonly workCenterId: WorkCenterId;
  readonly runtimeMinutes: Minute;
  readonly vibrationBasisPoints: number;
  readonly temperatureBasisPoints: number;
  readonly alarmCount: number;
}

export interface MachineHealthScore {
  readonly workCenterId: WorkCenterId;
  readonly scoreBasisPoints: number;
  readonly risk: 'low' | 'medium' | 'high';
  readonly maintenanceRecommended: boolean;
}
