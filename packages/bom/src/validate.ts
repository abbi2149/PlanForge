import { failure, success, type ItemId, type ModelResult } from '@planforge/model';
import type { BillOfMaterial } from './types.js';

export function validateBom(boms: readonly BillOfMaterial[]): ModelResult<readonly BillOfMaterial[]> {
  const byItem = new Map<ItemId, BillOfMaterial>();
  for (const bom of boms) {
    if (byItem.has(bom.itemId)) return failure({ code: 'BOM_DUPLICATE', message: `duplicate BOM for ${bom.itemId}` });
    byItem.set(bom.itemId, bom);
    const componentIds = new Set<string>();
    for (const component of bom.components) {
      if (componentIds.has(component.itemId)) return failure({ code: 'BOM_DUPLICATE_COMPONENT', message: `${bom.itemId} repeats ${component.itemId}` });
      componentIds.add(component.itemId);
      if (component.quantityPer <= 0 || component.scrapBasisPoints < 0 || component.scrapBasisPoints > 10_000) {
        return failure({ code: 'BOM_COMPONENT', message: `invalid component ${component.itemId} in ${bom.itemId}` });
      }
    }
  }
  const visiting = new Set<ItemId>();
  const visited = new Set<ItemId>();
  const visit = (itemId: ItemId): boolean => {
    if (visiting.has(itemId)) return false;
    if (visited.has(itemId)) return true;
    visiting.add(itemId);
    for (const component of byItem.get(itemId)?.components ?? []) {
      if (byItem.has(component.itemId) && !visit(component.itemId)) return false;
    }
    visiting.delete(itemId);
    visited.add(itemId);
    return true;
  };
  for (const itemId of byItem.keys()) {
    if (!visit(itemId)) return failure({ code: 'BOM_CYCLE', message: `BOM cycle contains ${itemId}` });
  }
  return success([...boms]);
}
