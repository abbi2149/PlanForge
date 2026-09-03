import { failure, success, type ModelResult } from '@planforge/model';
import type { ProductionTrace } from './types.js';

export function validateTraces(traces: readonly ProductionTrace[]): ModelResult<readonly ProductionTrace[]> {
  const outputLots = new Set<string>();
  for (const trace of traces) {
    if (trace.orderId.length === 0 || trace.operationId.length === 0) {
      return failure({ code: 'TRACE_ID', message: 'trace order and operation ids cannot be empty' });
    }
    for (const entry of [...trace.inputs, ...trace.outputs]) {
      if (entry.quantity <= 0 || entry.sourceReference.length === 0) {
        return failure({ code: 'TRACE_MATERIAL', message: `invalid trace material ${entry.lotId}` });
      }
    }
    for (const output of trace.outputs) {
      if (outputLots.has(output.lotId)) return failure({ code: 'TRACE_DUPLICATE_OUTPUT', message: `lot ${output.lotId} has multiple producers` });
      outputLots.add(output.lotId);
    }
  }
  return success([...traces]);
}
