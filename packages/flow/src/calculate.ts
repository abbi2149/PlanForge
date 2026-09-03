import type { FlowMetrics, FlowObservation } from './types.js';

export function calculateFlow(observation: FlowObservation): FlowMetrics {
  const waitMinutes = Math.max(0, observation.startMinute - observation.releaseMinute) as FlowMetrics['waitMinutes'];
  const processingSpanMinutes = Math.max(0, observation.completionMinute - observation.startMinute) as FlowMetrics['processingSpanMinutes'];
  const totalFlowMinutes = Math.max(0, observation.completionMinute - observation.releaseMinute) as FlowMetrics['totalFlowMinutes'];
  return {
    orderId: observation.orderId,
    waitMinutes,
    processingSpanMinutes,
    totalFlowMinutes,
    velocityUnitsPerHour: totalFlowMinutes === 0 ? 0 : (observation.quantity * 60) / totalFlowMinutes,
  };
}
