import { validateBom } from '@planforge/bom';
import { validateCalendar } from '@planforge/calendar';
import { validateInventory } from '@planforge/inventory';
import { validateMaintenance } from '@planforge/maintenance';
import { failure, success, validateItems, validateOrders, validateRoutings, type ModelResult } from '@planforge/model';
import { validateQualityProfile } from '@planforge/quality';
import { validateRouting } from '@planforge/routing';
import type { FactoryModel } from './types.js';

export function validateFactoryModel(model: FactoryModel): ModelResult<FactoryModel> {
  if (model.name.length === 0) return failure({ code: 'API_FACTORY_NAME', message: 'factory name cannot be empty' });
  for (const result of [validateItems(model.items), validateOrders(model.orders), validateRoutings(model.routings)]) {
    if (!result.ok) return result;
  }
  const calendar = validateCalendar(model.calendar);
  if (!calendar.ok) return calendar;
  for (const routing of model.routings) {
    const result = validateRouting(routing);
    if (!result.ok) return result;
  }
  if (model.boms) {
    const result = validateBom(model.boms);
    if (!result.ok) return result;
  }
  if (model.inventoryLots || model.inventoryReceipts || model.inventoryDemands) {
    const result = validateInventory(model.inventoryLots ?? [], model.inventoryReceipts ?? [], model.inventoryDemands ?? []);
    if (!result.ok) return result;
  }
  if (model.maintenancePolicies || model.maintenanceWindows) {
    const result = validateMaintenance(model.maintenancePolicies ?? [], model.maintenanceWindows ?? []);
    if (!result.ok) return result;
  }
  for (const profile of model.qualityProfiles ?? []) {
    const result = validateQualityProfile(profile);
    if (!result.ok) return result;
  }
  const itemIds = new Set(model.items.map((item) => item.id));
  const missingOrderItems = [...new Set(model.orders.filter((order) => !itemIds.has(order.itemId)).map((order) => order.itemId))].sort();
  if (missingOrderItems.length > 0) {
    return failure({ code: 'API_UNKNOWN_ORDER_ITEM', message: `orders reference unknown items: ${missingOrderItems.join(', ')}` });
  }
  return success(model);
}
