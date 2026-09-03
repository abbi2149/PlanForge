import { operationDuration } from '@planforge/routing';
import type { MoneyMinor, OperationSpec, Quantity } from '@planforge/model';
import type { OperationCost, WorkCenterRate } from './types.js';

export function costOperation(operation: OperationSpec, quantity: Quantity, rate: WorkCenterRate): OperationCost {
  const totalMinutes = operationDuration(operation, quantity);
  const runMinutes = operation.runMinutesPerUnit * quantity;
  const laborMinor = (totalMinutes * rate.laborMinorPerMinute) as MoneyMinor;
  const machineMinor = (runMinutes * rate.machineMinorPerMinute) as MoneyMinor;
  const setupMinor = (operation.setupMinutes * rate.setupMinorPerMinute) as MoneyMinor;
  return {
    operationId: operation.id,
    laborMinor,
    machineMinor,
    setupMinor,
    totalMinor: (laborMinor + machineMinor + setupMinor) as MoneyMinor,
  };
}
