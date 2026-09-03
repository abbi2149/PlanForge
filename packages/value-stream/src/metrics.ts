import type { Minute } from '@planforge/model';
import type { ValueStreamMap, ValueStreamMetrics } from './types.js';

export function valueStreamMetrics(map: ValueStreamMap): ValueStreamMetrics {
  const processMinutes = map.steps.reduce((sum, step) => sum + step.processMinutes, 0) as Minute;
  const waitMinutes = map.steps.reduce((sum, step) => sum + step.waitMinutes, 0) as Minute;
  const leadMinutes = (processMinutes + waitMinutes) as Minute;
  let yieldRatio = 10_000;
  for (const step of map.steps) yieldRatio = Math.floor((yieldRatio * step.firstPassYieldBasisPoints) / 10_000);
  return {
    processMinutes,
    waitMinutes,
    leadMinutes,
    processCycleEfficiencyBasisPoints: leadMinutes === 0 ? 0 : Math.round((processMinutes * 10_000) / leadMinutes),
    rolledYieldBasisPoints: yieldRatio,
    totalInventoryUnits: map.steps.reduce((sum, step) => sum + step.inventoryUnits, 0),
  };
}
