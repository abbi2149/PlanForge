import type { CapacityLedger, CapacityReservation } from './types.js';

export const emptyLedger = (): CapacityLedger => ({ reservations: [] });

const key = (entry: CapacityReservation): string =>
  `${entry.workCenterId}\u0000${entry.start.toString().padStart(12, '0')}\u0000${entry.end.toString().padStart(12, '0')}\u0000${entry.orderId}\u0000${entry.operationId}`;

export function addReservation(ledger: CapacityLedger, reservation: CapacityReservation): CapacityLedger {
  return { reservations: [...ledger.reservations, { ...reservation }].sort((a, b) => key(a).localeCompare(key(b))) };
}

export function removeOrderReservations(ledger: CapacityLedger, orderId: string): CapacityLedger {
  return { reservations: ledger.reservations.filter((entry) => entry.orderId !== orderId) };
}

export function reservationsForCenter(ledger: CapacityLedger, workCenterId: string): readonly CapacityReservation[] {
  return ledger.reservations.filter((entry) => entry.workCenterId === workCenterId);
}
