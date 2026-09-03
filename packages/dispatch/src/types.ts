import type { DemandOrder, Minute, ScheduledOperation, WorkCenterId } from '@planforge/model';

export interface DispatchTicket {
  readonly orderId: string;
  readonly operationId: string;
  readonly workCenterId: WorkCenterId;
  readonly plannedStart: Minute;
  readonly plannedEnd: Minute;
  readonly sequence: number;
  readonly status: 'queued' | 'ready' | 'running' | 'done' | 'blocked';
}

export interface DispatchBoard {
  readonly generatedAtMinute: Minute;
  readonly tickets: readonly DispatchTicket[];
}

export interface DispatchContext {
  readonly orders: readonly DemandOrder[];
  readonly operations: readonly ScheduledOperation[];
  readonly now: Minute;
}
