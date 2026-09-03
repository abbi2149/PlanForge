import type { Minute } from '@planforge/model';

export interface SlaPolicy {
  readonly id: string;
  readonly maximumLeadMinutes: Minute;
  readonly maximumLateMinutes: Minute;
  readonly minimumOnTimeBasisPoints: number;
}

export interface SlaObservation {
  readonly reference: string;
  readonly releasedMinute: Minute;
  readonly promisedMinute: Minute;
  readonly completedMinute: Minute;
}

export interface SlaEvaluation {
  readonly policyId: string;
  readonly compliant: boolean;
  readonly onTimeBasisPoints: number;
  readonly averageLeadMinutes: number;
  readonly maximumLateMinutes: number;
}
