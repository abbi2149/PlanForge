import type { InventoryTurnResult } from './types.js';

export function rankInventoryTurns(results: readonly InventoryTurnResult[]): readonly InventoryTurnResult[] {
  return [...results].sort((a, b) => b.turns - a.turns || a.itemId.localeCompare(b.itemId));
}

export function slowMovingInventory(results: readonly InventoryTurnResult[], maximumTurns: number): readonly InventoryTurnResult[] {
  return results.filter((result) => result.turns < maximumTurns).sort((a, b) => a.turns - b.turns || a.itemId.localeCompare(b.itemId));
}
