import type { ItemId, Minute } from '@planforge/model';

export interface LeadTimeComponent {
  readonly itemId: ItemId;
  readonly queueMinutes: Minute;
  readonly setupMinutes: Minute;
  readonly runMinutes: Minute;
  readonly moveMinutes: Minute;
  readonly waitMinutes: Minute;
}

export interface LeadTimeResult {
  readonly itemId: ItemId;
  readonly valueAddedMinutes: Minute;
  readonly nonValueAddedMinutes: Minute;
  readonly totalMinutes: Minute;
  readonly valueAddedBasisPoints: number;
}
