import type { ItemId, Quantity } from '@planforge/model';
import type { BillOfMaterial, MaterialRequirement } from './types.js';

export function explodeBom(
  boms: readonly BillOfMaterial[],
  itemId: ItemId,
  quantity: Quantity,
): readonly MaterialRequirement[] {
  const byItem = new Map(boms.map((bom) => [bom.itemId, bom]));
  const accumulated = new Map<string, MaterialRequirement>();
  const visit = (parentItemId: ItemId, required: Quantity, level: number): void => {
    const bom = byItem.get(parentItemId);
    if (!bom) return;
    for (const component of bom.components) {
      const base = required * component.quantityPer;
      const withScrap = Math.ceil((base * (10_000 + component.scrapBasisPoints)) / 10_000) as Quantity;
      const key = `${component.itemId}\u0000${level}`;
      const previous = accumulated.get(key);
      accumulated.set(key, {
        itemId: component.itemId,
        quantity: ((previous?.quantity ?? 0) + withScrap) as Quantity,
        level,
        parentItemId,
      });
      visit(component.itemId, withScrap, level + 1);
    }
  };
  visit(itemId, quantity, 1);
  return [...accumulated.values()].sort((a, b) => a.level - b.level || a.itemId.localeCompare(b.itemId));
}
