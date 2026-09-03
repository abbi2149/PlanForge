import type { LotId, Quantity } from '@planforge/model';
import type { BatchDefinition } from './types.js';

export function mergeBatches(name: LotId, batches: readonly BatchDefinition[]): BatchDefinition | null {
  if (batches.length === 0) return null;
  const itemId = batches[0]!.itemId;
  if (!batches.every((batch) => batch.itemId === itemId)) return null;
  return {
    id: name,
    itemId,
    targetQuantity: batches.reduce((sum, batch) => sum + batch.targetQuantity, 0) as Quantity,
    minimumQuantity: batches.reduce((sum, batch) => sum + batch.minimumQuantity, 0) as Quantity,
    maximumQuantity: batches.reduce((sum, batch) => sum + batch.maximumQuantity, 0) as Quantity,
    releaseMinute: Math.max(...batches.map((batch) => batch.releaseMinute)) as BatchDefinition['releaseMinute'],
  };
}
