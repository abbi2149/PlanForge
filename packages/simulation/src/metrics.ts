import type { SimulationResult } from './types.js';

export interface SimulationMetrics {
  readonly meanDelayMinutes: number;
  readonly maximumDelayMinutes: number;
  readonly lateOrderCount: number;
  readonly outputLoss: number;
}

export function simulationMetrics(result: SimulationResult): SimulationMetrics {
  const delays = result.operations.map((entry) => (entry.simulatedEnd - entry.simulatedStart) - (entry.plannedEnd - entry.plannedStart));
  const outputLoss = result.operations.reduce((sum, entry) => sum + Math.max(0, entry.plannedEnd >= entry.plannedStart ? 0 : 0), 0);
  return {
    meanDelayMinutes: delays.length === 0 ? 0 : delays.reduce((a, b) => a + b, 0) / delays.length,
    maximumDelayMinutes: Math.max(0, ...delays),
    lateOrderCount: result.lateOrders.length,
    outputLoss,
  };
}
