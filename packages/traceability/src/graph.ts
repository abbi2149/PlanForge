import type { LotId } from '@planforge/model';
import type { ProductionTrace } from './types.js';

export function inputEdges(traces: readonly ProductionTrace[]): ReadonlyMap<LotId, readonly LotId[]> {
  const map = new Map<LotId, LotId[]>();
  for (const trace of traces) {
    for (const output of trace.outputs) {
      const inputs = trace.inputs.map((entry) => entry.lotId).sort();
      map.set(output.lotId, [...new Set([...(map.get(output.lotId) ?? []), ...inputs])].sort() as LotId[]);
    }
  }
  return map;
}

export function outputEdges(traces: readonly ProductionTrace[]): ReadonlyMap<LotId, readonly LotId[]> {
  const map = new Map<LotId, LotId[]>();
  for (const trace of traces) {
    for (const input of trace.inputs) {
      const outputs = trace.outputs.map((entry) => entry.lotId).sort();
      map.set(input.lotId, [...new Set([...(map.get(input.lotId) ?? []), ...outputs])].sort() as LotId[]);
    }
  }
  return map;
}
