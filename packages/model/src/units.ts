import { failure, success, type ModelResult } from './result.js';

export type Minute = number & { readonly __brand: 'Minute' };
export type Quantity = number & { readonly __brand: 'Quantity' };
export type BasisPoints = number & { readonly __brand: 'BasisPoints' };
export type MoneyMinor = number & { readonly __brand: 'MoneyMinor' };

function integerUnit<T extends number>(name: string, value: unknown, minimum: number): ModelResult<T> {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < minimum) {
    return failure({ code: 'MODEL_INVALID_UNIT', message: `${name} must be an integer >= ${minimum}`, path: name });
  }
  return success(value as T);
}

export const minute = (value: unknown): ModelResult<Minute> => integerUnit<Minute>('minute', value, 0);
export const quantity = (value: unknown): ModelResult<Quantity> =>
  integerUnit<Quantity>('quantity', value, 0);
export const moneyMinor = (value: unknown): ModelResult<MoneyMinor> =>
  integerUnit<MoneyMinor>('moneyMinor', value, 0);

export function basisPoints(value: unknown): ModelResult<BasisPoints> {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < 0 || value > 10_000) {
    return failure({ code: 'MODEL_INVALID_BPS', message: 'basisPoints must be an integer from 0 through 10000' });
  }
  return success(value as BasisPoints);
}

export function multiplyQuantity(value: Quantity, numerator: number, denominator: number): Quantity {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator <= 0) {
    throw new RangeError('ratio must use safe integers and a positive denominator');
  }
  return Math.ceil((value * numerator) / denominator) as Quantity;
}

export function applyBasisPoints(value: number, rate: BasisPoints): number {
  return Math.round((value * rate) / 10_000);
}
