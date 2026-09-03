import type { Minute, OperationSpec, Quantity } from '@planforge/model';

export function requiredProductionQuantity(output: Quantity, yieldBasisPoints: number): Quantity {
  if (yieldBasisPoints <= 0) throw new RangeError('yield must be greater than zero');
  return Math.ceil((output * 10_000) / yieldBasisPoints) as Quantity;
}

export function scheduledDuration(operation: OperationSpec, output: Quantity): Minute {
  const inputQuantity = requiredProductionQuantity(output, operation.yieldBasisPoints);
  return (operation.setupMinutes + operation.runMinutesPerUnit * inputQuantity) as Minute;
}
