import type { DispatchBoard, DispatchTicket } from './types.js';

export function withTicketStatus(
  board: DispatchBoard,
  operationId: string,
  status: DispatchTicket['status'],
): DispatchBoard {
  return {
    generatedAtMinute: board.generatedAtMinute,
    tickets: board.tickets.map((ticket) => ticket.operationId === operationId ? { ...ticket, status } : ticket),
  };
}

export function blockedTickets(board: DispatchBoard): readonly DispatchTicket[] {
  return board.tickets.filter((ticket) => ticket.status === 'blocked').sort((a, b) => a.workCenterId.localeCompare(b.workCenterId) || a.sequence - b.sequence);
}
