import type { PlanAnalytics } from './types.js';

export interface AnalyticsDelta {
  readonly makespan: number;
  readonly workCenterUtilization: Readonly<Record<string, number>>;
  readonly orderFlow: Readonly<Record<string, number>>;
}

export function compareAnalytics(left: PlanAnalytics, right: PlanAnalytics): AnalyticsDelta {
  const leftCenter = new Map(left.workCenters.map((entry) => [entry.workCenterId, entry.utilizationBasisPoints]));
  const rightCenter = new Map(right.workCenters.map((entry) => [entry.workCenterId, entry.utilizationBasisPoints]));
  const centers = [...new Set([...leftCenter.keys(), ...rightCenter.keys()])].sort();
  const leftOrder = new Map(left.orders.map((entry) => [entry.orderId, entry.flowMinutes]));
  const rightOrder = new Map(right.orders.map((entry) => [entry.orderId, entry.flowMinutes]));
  const orders = [...new Set([...leftOrder.keys(), ...rightOrder.keys()])].sort();
  return {
    makespan: right.makespan - left.makespan,
    workCenterUtilization: Object.fromEntries(centers.map((center) => [center, (rightCenter.get(center) ?? 0) - (leftCenter.get(center) ?? 0)])),
    orderFlow: Object.fromEntries(orders.map((order) => [order, (rightOrder.get(order) ?? 0) - (leftOrder.get(order) ?? 0)])),
  };
}
