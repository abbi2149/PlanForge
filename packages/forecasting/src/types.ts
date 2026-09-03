import type { ItemId, Quantity } from '@planforge/model';

export interface DemandPoint {
  readonly period: number;
  readonly itemId: ItemId;
  readonly quantity: Quantity;
}

export interface ForecastPoint {
  readonly period: number;
  readonly itemId: ItemId;
  readonly quantity: Quantity;
  readonly method: string;
}

export interface ForecastMetrics {
  readonly mae: number;
  readonly mse: number;
  readonly mapeBasisPoints: number;
  readonly bias: number;
}
