import type { Quantity } from '@planforge/model';
import type { AllocationLine, AllocationRequest } from './types.js';

export function fillRateBasisPoints(request: AllocationRequest, lines: readonly AllocationLine[]): number {
  const filled = lines.filter((line) => line.requestId === request.requestId).reduce((sum, line) => sum + line.quantity, 0);
  return request.quantity === 0 ? 10_000 : Math.min(10_000, Math.round((filled * 10_000) / request.quantity));
}

export function totalAllocated(lines: readonly AllocationLine[], requestId: string): Quantity {
  return lines.filter((line) => line.requestId === requestId).reduce((sum, line) => sum + line.quantity, 0) as Quantity;
}
