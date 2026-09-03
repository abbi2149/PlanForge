import type { Minute, WorkCenterId } from '@planforge/model';

export interface Disruption {
  readonly id: string;
  readonly workCenterId: WorkCenterId;
  readonly start: Minute;
  readonly end: Minute;
  readonly severityBasisPoints: number;
}

export interface ResilienceScore {
  readonly planDigest: string;
  readonly affectedOperations: number;
  readonly exposedMinutes: Minute;
  readonly severityWeightedMinutes: number;
  readonly scoreBasisPoints: number;
}

export interface RecoveryAction {
  readonly disruptionId: string;
  readonly action: 'expedite-maintenance' | 'reroute' | 'overtime' | 'buffer';
  readonly estimatedRecoveryMinutes: Minute;
  readonly costMinor: number;
}
