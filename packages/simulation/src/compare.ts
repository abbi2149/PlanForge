import type { SimulationResult } from './types.js';

export interface SimulationDifference {
  readonly makespanDelta: number;
  readonly lateOrderDelta: number;
  readonly changedOrders: readonly string[];
}

export function compareSimulations(left: SimulationResult, right: SimulationResult): SimulationDifference {
  const all = new Set([...Object.keys(left.completionByOrder), ...Object.keys(right.completionByOrder)]);
  const changedOrders = [...all]
    .filter((id) => left.completionByOrder[id] !== right.completionByOrder[id])
    .sort();
  return {
    makespanDelta: right.makespan - left.makespan,
    lateOrderDelta: right.lateOrders.length - left.lateOrders.length,
    changedOrders,
  };
}
