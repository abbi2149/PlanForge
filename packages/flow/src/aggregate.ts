import type { FlowMetrics } from './types.js';

export interface FlowSummary {
  readonly averageWaitMinutes: number;
  readonly averageFlowMinutes: number;
  readonly averageVelocityUnitsPerHour: number;
  readonly orderCount: number;
}

export function summarizeFlow(metrics: readonly FlowMetrics[]): FlowSummary {
  if (metrics.length === 0) return { averageWaitMinutes: 0, averageFlowMinutes: 0, averageVelocityUnitsPerHour: 0, orderCount: 0 };
  return {
    averageWaitMinutes: metrics.reduce((sum, entry) => sum + entry.waitMinutes, 0) / metrics.length,
    averageFlowMinutes: metrics.reduce((sum, entry) => sum + entry.totalFlowMinutes, 0) / metrics.length,
    averageVelocityUnitsPerHour: metrics.reduce((sum, entry) => sum + entry.velocityUnitsPerHour, 0) / metrics.length,
    orderCount: metrics.length,
  };
}
