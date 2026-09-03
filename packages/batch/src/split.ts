import type { LotId, Quantity } from '@planforge/model';
import type { BatchDefinition } from './types.js';

export function splitBatch(batch: BatchDefinition, lotSize: Quantity): readonly BatchDefinition[] {
  if (lotSize <= 0 || batch.targetQuantity <= lotSize) return [batch];
  const result: BatchDefinition[] = [];
  let remaining = batch.targetQuantity;
  let sequence = 1;
  while (remaining > 0) {
    const targetQuantity = Math.min(lotSize, remaining) as Quantity;
    result.push({
      ...batch,
      id: `${batch.id}:${sequence}` as LotId,
      targetQuantity,
      minimumQuantity: Math.min(batch.minimumQuantity, targetQuantity) as Quantity,
      maximumQuantity: Math.min(batch.maximumQuantity, targetQuantity) as Quantity,
    });
    remaining = (remaining - targetQuantity) as Quantity;
    sequence += 1;
  }
  return result;
}
