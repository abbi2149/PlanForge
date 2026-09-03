import type { Minute, WorkCenterId } from '@planforge/model';

export interface WorkCenterKpi {
  readonly workCenterId: WorkCenterId;
  readonly operationCount: number;
  readonly busyMinutes: Minute;
  readonly spanMinutes: Minute;
  readonly utilizationBasisPoints: number;
  readonly averageOperationMinutes: number;
}

export interface OrderKpi {
  readonly orderId: string;
  readonly firstStart: Minute;
  readonly completion: Minute;
  readonly flowMinutes: Minute;
  readonly operationCount: number;
}

export interface PlanAnalytics {
  readonly planDigest: string;
  readonly workCenters: readonly WorkCenterKpi[];
  readonly orders: readonly OrderKpi[];
  readonly makespan: Minute;
}
