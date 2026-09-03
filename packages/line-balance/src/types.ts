import type { Minute, OperationId, WorkCenterId } from '@planforge/model';

export interface BalanceTask {
  readonly operationId: OperationId;
  readonly duration: Minute;
  readonly predecessors: readonly OperationId[];
}

export interface StationAssignment {
  readonly station: number;
  readonly operationIds: readonly OperationId[];
  readonly loadMinutes: Minute;
  readonly slackMinutes: Minute;
}

export interface LineBalance {
  readonly cycleTime: Minute;
  readonly stations: readonly StationAssignment[];
  readonly efficiencyBasisPoints: number;
  readonly balanceDelayBasisPoints: number;
}

export interface StationWorkCenter {
  readonly station: number;
  readonly workCenterId: WorkCenterId;
}
