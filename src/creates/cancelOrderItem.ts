/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BASE_URL } from '../constants';
import { v4 as uuidv4 } from 'uuid';

import response from '../samples/update-response.json';
import { Bundle, ZObject } from 'zapier-platform-core';
import { CancellationRequest } from '../types/CancellationRequest';
import { CancellationReasonCode } from '../types/CancellationReasonCode';

export type Input = {
  order_id: string;
  retailer_id: string;
  item_id?: string;
  quantity: number;
  reason_code: CancellationReasonCode;
  reason_description?: string;
  restock_items?: boolean;
};

const perform = async (z: ZObject, bundle: Bundle<Input>) => {
  const {
    order_id,
    retailer_id,
    item_id,
    quantity,
    reason_code,
    reason_description,
    restock_items,
  } = bundle.inputData;
  const hasRetailerId = retailer_id != null && retailer_id.trim() !== '';
  const body: CancellationRequest = {
    cancel_reason: {
      reason_code: reason_code,
      reason_description: reason_description,
    },
    restock_items: restock_items,
    items: [
      {
        retailer_id: hasRetailerId ? retailer_id : undefined,
        item_id: !hasRetailerId ? item_id : undefined,
        quantity: quantity,
      },
    ],
    idempotency_key: uuidv4(),
  };

  const response = await z.request({
    url: `${BASE_URL}/${order_id}/cancellations`,
    method: 'POST',
    body: body,
    headers: {
      prefixErrorMessageWith: 'Unable to cancel your Meta Shop orders',
    },
  });

  return response.data;
};

export default {
  key: 'cancelOrderItem',
  noun: 'Cancel Order Item',
  display: {
    label: 'Cancel Order Item',
    description: 'Cancels an order item',
    hidden: false,
  },
  operation: {
    perform,
    inputFields: [
      { key: 'order_id', required: true },
      { key: 'retailer_id', type: 'string', required: true },
      { key: 'item_id', type: 'string', required: false },
      { key: 'quantity', type: 'integer', required: true },
      {
        key: 'reason_code',
        type: 'string',
        required: true,
        choices: [
          'CUSTOMER_REQUESTED',
          'OUT_OF_STOCK',
          'INVALID_ADDRESS',
          'SUSPICIOUS_ORDER',
          'CANCEL_REASON_OTHER',
        ],
      },
      { key: 'reason_description', type: 'string', required: false },
      { key: 'restock_items', type: 'boolean', required: false },
    ],
    sample: response,
  },
};
