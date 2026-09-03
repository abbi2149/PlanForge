import type { Quantity } from '@planforge/model';
import type { KanbanCard } from './types.js';

export function kanbanCoverage(cards: readonly KanbanCard[]): Quantity {
  return cards
    .filter((card) => card.status !== 'consumed')
    .reduce((sum, card) => sum + card.containerQuantity, 0) as Quantity;
}

export function kanbanCoveragePeriods(cards: readonly KanbanCard[], demandPerPeriod: Quantity): number {
  if (demandPerPeriod <= 0) return Number.POSITIVE_INFINITY;
  return kanbanCoverage(cards) / demandPerPeriod;
}
