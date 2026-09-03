import type { ItemId, Minute, WorkCenterId } from '@planforge/model';

export interface ChangeoverRule {
  readonly workCenterId: WorkCenterId;
  readonly fromFamily: string;
  readonly toFamily: string;
  readonly minutes: Minute;
  readonly costMinor: number;
}

export interface ItemFamily {
  readonly itemId: ItemId;
  readonly family: string;
}

export interface ChangeoverEvent {
  readonly workCenterId: WorkCenterId;
  readonly fromOrderId: string;
  readonly toOrderId: string;
  readonly fromFamily: string;
  readonly toFamily: string;
  readonly minutes: Minute;
  readonly costMinor: number;
}
