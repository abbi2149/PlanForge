import type { DispatchBoard, DispatchTicket } from './types.js';

export function resequenceCenter(
  board: DispatchBoard,
  workCenterId: string,
  orderedOperationIds: readonly string[],
): DispatchBoard {
  const rank = new Map(orderedOperationIds.map((id, index) => [id, index]));
  const target = board.tickets
    .filter((ticket) => ticket.workCenterId === workCenterId)
    .sort((a, b) => (rank.get(a.operationId) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b.operationId) ?? Number.MAX_SAFE_INTEGER) || a.sequence - b.sequence)
    .map((ticket, index): DispatchTicket => ({ ...ticket, sequence: index + 1 }));
  const byOperation = new Map(target.map((ticket) => [ticket.operationId, ticket]));
  return {
    generatedAtMinute: board.generatedAtMinute,
    tickets: board.tickets.map((ticket) => byOperation.get(ticket.operationId) ?? ticket),
  };
}
