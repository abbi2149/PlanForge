import type { Quantity } from '@planforge/model';
import type { BatchAllocation, BatchDefinition, BatchStatus } from './types.js';

export function batchStatus(batch: BatchDefinition, allocations: readonly BatchAllocation[]): BatchStatus {
  const allocated = allocations
    .filter((entry) => entry.batchId === batch.id)
    .reduce((sum, entry) => sum + entry.quantity, 0) as Quantity;
  return {
    batchId: batch.id,
    allocated,
    remaining: Math.max(0, batch.targetQuantity - allocated) as Quantity,
    full: allocated >= batch.targetQuantity,
  };
}
