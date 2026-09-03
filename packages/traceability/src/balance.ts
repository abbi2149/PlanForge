import type { ItemId, Quantity } from '@planforge/model';
import type { ProductionTrace } from './types.js';

export interface MaterialBalance {
  readonly itemId: ItemId;
  readonly input: Quantity;
  readonly output: Quantity;
  readonly difference: number;
}

export function materialBalance(traces: readonly ProductionTrace[]): readonly MaterialBalance[] {
  const ids = [...new Set(traces.flatMap((trace) => [...trace.inputs, ...trace.outputs].map((entry) => entry.itemId)))].sort();
  return ids.map((itemId) => {
    const input = traces.flatMap((trace) => trace.inputs).filter((entry) => entry.itemId === itemId).reduce((sum, entry) => sum + entry.quantity, 0) as Quantity;
    const output = traces.flatMap((trace) => trace.outputs).filter((entry) => entry.itemId === itemId).reduce((sum, entry) => sum + entry.quantity, 0) as Quantity;
    return { itemId, input, output, difference: output - input };
  });
}
