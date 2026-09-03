import type { KanbanCard, KanbanPolicy } from './types.js';
import { sizeKanban } from './size.js';

export function createKanbanCards(policy: KanbanPolicy): readonly KanbanCard[] {
  const sizing = sizeKanban(policy);
  return Array.from({ length: sizing.cards }, (_, index) => ({
    id: `${policy.itemId}:KANBAN:${index + 1}`,
    itemId: policy.itemId,
    containerQuantity: policy.containerQuantity,
    status: 'available' as const,
  }));
}

export function withCardStatus(cards: readonly KanbanCard[], id: string, status: KanbanCard['status']): readonly KanbanCard[] {
  return cards.map((card) => card.id === id ? { ...card, status } : card);
}
