import { failure, success, type ModelResult } from '@planforge/model';
import type { DeliveryWindow } from './types.js';

export function validateDeliveryWindow(window: DeliveryWindow): ModelResult<DeliveryWindow> {
  if (window.id.length === 0 || window.latest < window.earliest) {
    return failure({ code: 'DELIVERY_WINDOW', message: `invalid delivery window ${window.id}` });
  }
  return success(window);
}
