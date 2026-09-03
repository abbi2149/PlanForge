import type { DemandOrder, Minute, ProductionPlan, Quantity, WorkCenterId } from '@planforge/model';

export interface DelayRule {
  readonly workCenterId: WorkCenterId;
  readonly everyNthOperation: number;
  readonly delayMinutes: Minute;
}

export interface YieldRule {
  readonly orderId: string;
  readonly lossBasisPoints: number;
}

export interface SimulationInput {
  readonly plan: ProductionPlan;
  readonly orders: readonly DemandOrder[];
  readonly delayRules?: readonly DelayRule[];
  readonly yieldRules?: readonly YieldRule[];
}

export interface SimulatedOperation {
  readonly orderId: string;
  readonly operationId: string;
  readonly workCenterId: WorkCenterId;
  readonly plannedStart: Minute;
  readonly plannedEnd: Minute;
  readonly simulatedStart: Minute;
  readonly simulatedEnd: Minute;
  readonly outputQuantity: Quantity;
}

export interface SimulationResult {
  readonly operations: readonly SimulatedOperation[];
  readonly completionByOrder: Readonly<Record<string, Minute>>;
  readonly lateOrders: readonly string[];
  readonly makespan: Minute;
}
