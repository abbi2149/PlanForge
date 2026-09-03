import { failure, success, type ModelResult } from './result.js';

export type WorkCenterId = string & { readonly __brand: 'WorkCenterId' };
export type ItemId = string & { readonly __brand: 'ItemId' };
export type OrderId = string & { readonly __brand: 'OrderId' };
export type OperationId = string & { readonly __brand: 'OperationId' };
export type RoutingId = string & { readonly __brand: 'RoutingId' };
export type ScenarioId = string & { readonly __brand: 'ScenarioId' };
export type ResourceId = string & { readonly __brand: 'ResourceId' };
export type LotId = string & { readonly __brand: 'LotId' };
export type MaintenanceId = string & { readonly __brand: 'MaintenanceId' };

const IDENTIFIER = /^[A-Za-z][A-Za-z0-9._:-]{0,63}$/;

function parseIdentifier<T extends string>(kind: string, value: unknown): ModelResult<T> {
  if (typeof value !== 'string' || !IDENTIFIER.test(value)) {
    return failure({
      code: 'MODEL_INVALID_ID',
      message: `${kind} must be a logical identifier`,
      path: kind,
    });
  }
  return success(value as T);
}

export const workCenterId = (value: unknown): ModelResult<WorkCenterId> =>
  parseIdentifier<WorkCenterId>('workCenterId', value);
export const itemId = (value: unknown): ModelResult<ItemId> => parseIdentifier<ItemId>('itemId', value);
export const orderId = (value: unknown): ModelResult<OrderId> => parseIdentifier<OrderId>('orderId', value);
export const operationId = (value: unknown): ModelResult<OperationId> =>
  parseIdentifier<OperationId>('operationId', value);
export const routingId = (value: unknown): ModelResult<RoutingId> =>
  parseIdentifier<RoutingId>('routingId', value);
export const scenarioId = (value: unknown): ModelResult<ScenarioId> =>
  parseIdentifier<ScenarioId>('scenarioId', value);
export const resourceId = (value: unknown): ModelResult<ResourceId> =>
  parseIdentifier<ResourceId>('resourceId', value);
export const lotId = (value: unknown): ModelResult<LotId> => parseIdentifier<LotId>('lotId', value);
export const maintenanceId = (value: unknown): ModelResult<MaintenanceId> =>
  parseIdentifier<MaintenanceId>('maintenanceId', value);

export function isLogicalIdentifier(value: unknown): value is string {
  return typeof value === 'string' && IDENTIFIER.test(value);
}
