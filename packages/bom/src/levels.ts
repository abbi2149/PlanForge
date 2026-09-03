import type { ItemId } from '@planforge/model';
import type { BillOfMaterial } from './types.js';

export function lowLevelCodes(boms: readonly BillOfMaterial[]): ReadonlyMap<ItemId, number> {
  const levels = new Map<ItemId, number>();
  const roots = boms.map((bom) => bom.itemId).filter((id) => !boms.some((candidate) => candidate.components.some((component) => component.itemId === id)));
  const byItem = new Map(boms.map((bom) => [bom.itemId, bom]));
  const queue = roots.map((itemId) => ({ itemId, level: 0 }));
  while (queue.length > 0) {
    const current = queue.shift()!;
    if ((levels.get(current.itemId) ?? -1) >= current.level) continue;
    levels.set(current.itemId, current.level);
    for (const component of byItem.get(current.itemId)?.components ?? []) {
      queue.push({ itemId: component.itemId, level: current.level + 1 });
    }
  }
  return levels;
}
