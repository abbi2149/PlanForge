import type { KanbanCard } from './types.js';

export function replenishmentSignals(cards: readonly KanbanCard[]): readonly KanbanCard[] {
  return cards.filter((card) => card.status === 'consumed').sort((a, b) => a.id.localeCompare(b.id));
}

export function availableContainers(cards: readonly KanbanCard[]): number {
  return cards.filter((card) => card.status === 'available').length;
}
