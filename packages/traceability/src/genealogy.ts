import type { LotId } from '@planforge/model';
import { inputEdges, outputEdges } from './graph.js';
import type { LotGenealogy, ProductionTrace } from './types.js';

function traverse(start: LotId, edges: ReadonlyMap<LotId, readonly LotId[]>): readonly LotId[] {
  const visited = new Set<LotId>();
  const queue = [...(edges.get(start) ?? [])];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    visited.add(current);
    queue.push(...(edges.get(current) ?? []));
  }
  return [...visited].sort();
}

export function lotGenealogy(traces: readonly ProductionTrace[], lotId: LotId): LotGenealogy {
  return {
    lotId,
    ancestors: traverse(lotId, inputEdges(traces)),
    descendants: traverse(lotId, outputEdges(traces)),
  };
}
