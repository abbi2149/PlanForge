import type { DispatchBoard, DispatchTicket } from './types.js';

export function queueForCenter(board: DispatchBoard, workCenterId: string): readonly DispatchTicket[] {
  return board.tickets
    .filter((ticket) => ticket.workCenterId === workCenterId && ticket.status !== 'done')
    .sort((a, b) => a.sequence - b.sequence || a.orderId.localeCompare(b.orderId));
}

export function nextTicket(board: DispatchBoard, workCenterId: string): DispatchTicket | null {
  return queueForCenter(board, workCenterId).find((ticket) => ticket.status === 'ready' || ticket.status === 'running') ?? null;
}
