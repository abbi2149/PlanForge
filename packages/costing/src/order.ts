import type { MoneyMinor, OrderId, Quantity, Routing } from '@planforge/model';
import { costOperation } from './operation.js';
import type { OrderCost, WorkCenterRate } from './types.js';

export function conversionCost(routing: Routing, quantity: Quantity, rates: readonly WorkCenterRate[]): MoneyMinor {
  const byCenter = new Map(rates.map((rate) => [rate.workCenterId, rate]));
  return routing.operations.reduce((sum, operation) => {
    const rate = byCenter.get(operation.workCenterId);
    return rate ? sum + costOperation(operation, quantity, rate).totalMinor : sum;
  }, 0) as MoneyMinor;
}

export function orderCost(
  orderId: OrderId,
  quantity: Quantity,
  materialMinor: MoneyMinor,
  conversionMinor: MoneyMinor,
  overheadBasisPoints: number,
): OrderCost {
  const overheadMinor = Math.round(((materialMinor + conversionMinor) * overheadBasisPoints) / 10_000) as MoneyMinor;
  return {
    orderId,
    quantity,
    materialMinor,
    conversionMinor,
    overheadMinor,
    totalMinor: (materialMinor + conversionMinor + overheadMinor) as MoneyMinor,
  };
}
