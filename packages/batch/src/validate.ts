import { failure, success, type ModelResult } from '@planforge/model';
import type { BatchDefinition } from './types.js';

export function validateBatches(batches: readonly BatchDefinition[]): ModelResult<readonly BatchDefinition[]> {
  const ids = new Set<string>();
  for (const batch of batches) {
    if (ids.has(batch.id)) return failure({ code: 'BATCH_DUPLICATE', message: `duplicate batch ${batch.id}` });
    ids.add(batch.id);
    if (batch.minimumQuantity <= 0 || batch.targetQuantity < batch.minimumQuantity || batch.targetQuantity > batch.maximumQuantity) {
      return failure({ code: 'BATCH_QUANTITY', message: `invalid batch quantities ${batch.id}` });
    }
  }
  return success([...batches]);
}
