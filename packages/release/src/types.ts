import type { DemandOrder, Minute, Quantity } from '@planforge/model';

export interface ReleasePolicy {
  readonly maximumWipQuantity: Quantity;
  readonly lookaheadMinutes: Minute;
  readonly priorityFloor: number;
}

export interface ReleasedOrder {
  readonly order: DemandOrder;
  readonly releasedAt: Minute;
  readonly reason: 'due-window' | 'priority' | 'capacity';
}
