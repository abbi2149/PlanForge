import type { ItemId, Minute, WorkCenterId } from '@planforge/model';

export interface SequenceJob {
  readonly orderId: string;
  readonly itemId: ItemId;
  readonly workCenterId: WorkCenterId;
  readonly family: string;
  readonly processingMinutes: Minute;
  readonly dueMinute: Minute;
  readonly priority: number;
}

export interface SequenceResult {
  readonly jobs: readonly SequenceJob[];
  readonly totalProcessingMinutes: Minute;
  readonly totalChangeoverMinutes: Minute;
  readonly totalTardinessMinutes: Minute;
}
