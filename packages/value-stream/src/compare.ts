import { valueStreamMetrics } from './metrics.js';
import type { ValueStreamMap } from './types.js';

export interface ValueStreamDelta {
  readonly leadMinutes: number;
  readonly processMinutes: number;
  readonly waitMinutes: number;
  readonly inventoryUnits: number;
  readonly processCycleEfficiencyBasisPoints: number;
  readonly rolledYieldBasisPoints: number;
}

export function compareValueStreams(left: ValueStreamMap, right: ValueStreamMap): ValueStreamDelta {
  const a = valueStreamMetrics(left);
  const b = valueStreamMetrics(right);
  return {
    leadMinutes: b.leadMinutes - a.leadMinutes,
    processMinutes: b.processMinutes - a.processMinutes,
    waitMinutes: b.waitMinutes - a.waitMinutes,
    inventoryUnits: b.totalInventoryUnits - a.totalInventoryUnits,
    processCycleEfficiencyBasisPoints: b.processCycleEfficiencyBasisPoints - a.processCycleEfficiencyBasisPoints,
    rolledYieldBasisPoints: b.rolledYieldBasisPoints - a.rolledYieldBasisPoints,
  };
}
