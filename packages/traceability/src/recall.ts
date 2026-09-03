import type { LotId } from '@planforge/model';
import type { ProductionTrace } from './types.js';
import { lotGenealogy } from './genealogy.js';

export interface RecallScope {
  readonly sourceLot: LotId;
  readonly affectedLots: readonly LotId[];
  readonly affectedOrders: readonly string[];
}

export function recallScope(traces: readonly ProductionTrace[], lotId: LotId): RecallScope {
  const genealogy = lotGenealogy(traces, lotId);
  const affected = new Set<LotId>([lotId, ...genealogy.descendants]);
  const orders = traces
    .filter((trace) => trace.inputs.some((entry) => affected.has(entry.lotId)) || trace.outputs.some((entry) => affected.has(entry.lotId)))
    .map((trace) => trace.orderId);
  return { sourceLot: lotId, affectedLots: [...affected].sort(), affectedOrders: [...new Set(orders)].sort() };
}
