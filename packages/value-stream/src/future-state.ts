import type { Minute } from '@planforge/model';
import type { ValueStreamMap, ValueStreamStep } from './types.js';

export interface FutureStateTarget {
  readonly waitReductionBasisPoints: number;
  readonly processReductionBasisPoints: number;
  readonly inventoryReductionBasisPoints: number;
}

export function futureStateMap(map: ValueStreamMap, target: FutureStateTarget): ValueStreamMap {
  const clamp = (value: number): number => Math.max(0, Math.min(10_000, value));
  const waitKeep = 10_000 - clamp(target.waitReductionBasisPoints);
  const processKeep = 10_000 - clamp(target.processReductionBasisPoints);
  const inventoryKeep = 10_000 - clamp(target.inventoryReductionBasisPoints);
  const steps: ValueStreamStep[] = map.steps.map((step) => ({
    ...step,
    waitMinutes: Math.round((step.waitMinutes * waitKeep) / 10_000) as Minute,
    processMinutes: Math.round((step.processMinutes * processKeep) / 10_000) as Minute,
    inventoryUnits: Math.round((step.inventoryUnits * inventoryKeep) / 10_000),
  }));
  return { name: `${map.name} future state`, steps };
}
