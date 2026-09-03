import type { WorkOrder } from './types.js';

const allowed: Readonly<Record<WorkOrder['status'], readonly WorkOrder['status'][]>> = {
  planned: ['released', 'cancelled'],
  released: ['running', 'cancelled'],
  running: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

export function transitionWorkOrder(order: WorkOrder, status: WorkOrder['status']): WorkOrder | null {
  return allowed[order.status].includes(status) ? { ...order, status } : null;
}
