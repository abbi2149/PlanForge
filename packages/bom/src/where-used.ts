import type { ItemId } from '@planforge/model';
import type { BillOfMaterial } from './types.js';

export function directParents(boms: readonly BillOfMaterial[], componentId: ItemId): readonly ItemId[] {
  return boms
    .filter((bom) => bom.components.some((component) => component.itemId === componentId))
    .map((bom) => bom.itemId)
    .sort();
}

export function allParents(boms: readonly BillOfMaterial[], componentId: ItemId): readonly ItemId[] {
  const result = new Set<ItemId>();
  const queue = [...directParents(boms, componentId)];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (result.has(current)) continue;
    result.add(current);
    queue.push(...directParents(boms, current));
  }
  return [...result].sort();
}
