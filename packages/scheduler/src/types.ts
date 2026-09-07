import type { CapacityLedger } from '@planforge/capacity';
import type { WorkCalendar } from '@planforge/calendar';
import type { DemandOrder, Minute, ProductionPlan, Routing, ScheduledOperation } from '@planforge/model';

/** Every dispatch rule the scheduler can apply, in stable documentation order. */
export const DISPATCH_RULES = ['priority', 'earliest-due', 'shortest-processing', 'critical-ratio'] as const;

export type DispatchRule = (typeof DISPATCH_RULES)[number];

export interface ScheduleInput {
  readonly name: string;
  readonly orders: readonly DemandOrder[];
  readonly routings: readonly Routing[];
  readonly calendar: WorkCalendar;
  readonly initialLedger?: CapacityLedger;
  readonly dispatchRule?: DispatchRule;
}

export interface ScheduleState {
  readonly ledger: CapacityLedger;
  readonly operations: readonly ScheduledOperation[];
  readonly completionByOrder: ReadonlyMap<string, Minute>;
  readonly warnings: readonly string[];
}

export interface ScheduleResult extends ProductionPlan {
  readonly makespan: Minute;
  readonly lateOrders: readonly string[];
}
