/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import response from '../samples/update-response.json';
import { Bundle, ZObject } from 'zapier-platform-core';
import fulfillOrderItem from './fulfillOrderItem';
import cancelOrderItem from './cancelOrderItem';
import refundOrderItem from './refundOrderItem';
import { CancellationReasonCode } from '../types/CancellationReasonCode';
import { RefundReasonCode } from '../types/RefundReasonCode';

export type Input = {
  order_id: string;
  retailer_id: string;
  item_id?: string;
  quantity: number;
  carrier?: string;
  tracking_number?: string;
  fulfillment_location_id?: string;
  merchant_order_reference?: string;
  cancel_reason?: CancellationReasonCode;
  cancel_message?: string;
  refund_amount?: number;
  refund_reason?: RefundReasonCode;
  action: 'FULFILL' | 'CANCEL' | 'REFUND';
};

const perform = async (z: ZObject, bundle: Bundle<Input>) => {
  const {
    order_id,
    retailer_id,
    item_id,
    quantity,
    carrier,
    tracking_number,
    fulfillment_location_id,
    merchant_order_reference,
    cancel_reason,
    cancel_message,
    refund_amount,
    refund_reason,
    action,
  } = bundle.inputData;

  if (action?.toUpperCase() === 'FULFILL') {
    if (tracking_number == null) {
      throw new z.errors.Error('Tracking number is missing');
    }
    if (carrier == null) {
      throw new z.errors.Error('Carrier is missing');
    }
    const newBundle = {
      ...bundle,
      inputData: {
        order_id: order_id,
        retailer_id: retailer_id,
        item_id: item_id,
        quantity: quantity,
        tracking_number: tracking_number,
        carrier: carrier,
        fulfillment_location_id: fulfillment_location_id,
        merchant_order_reference: merchant_order_reference,
      },
    };
    return fulfillOrderItem.operation.perform(z, newBundle);
  } else if (action?.toUpperCase() == 'CANCEL') {
    if (cancel_reason == null) {
      throw new z.errors.Error('Cancel reason is missing');
    }
    const newBundle = {
      ...bundle,
      inputData: {
        order_id: order_id,
        retailer_id: retailer_id,
        item_id: item_id,
        quantity: quantity,
        reason_code: cancel_reason,
        reason_description: cancel_message,
      },
    };
    return cancelOrderItem.operation.perform(z, newBundle);
  } else if (action?.toUpperCase() == 'REFUND') {
    if (refund_reason == null) {
      throw new z.errors.Error('Cancel reason is missing');
    }
    const newBundle = {
      ...bundle,
      inputData: {
        order_id: order_id,
        retailer_id: retailer_id,
        item_id: item_id,
        item_refund_quantity: quantity,
        item_refund_amount: refund_amount,
        reason_code: refund_reason,
      },
    };
    return refundOrderItem.operation.perform(z, newBundle);
  }
  return { success: 'false', message: 'Action not recognized: ' + action };
};

export default {
  key: 'updateOrderItem',
  noun: 'Update Order Item',
  display: {
    label: 'Updated Order Item',
    description: 'Updates an order item: Fullfill, Cancel or Refund based on an ACTION field.',
    hidden: false,
  },
  operation: {
    perform,
    inputFields: [
      { key: 'order_id', required: true },
      { key: 'retailer_id', type: 'string', required: true },
      { key: 'item_id', type: 'string', required: false },
      { key: 'quantity', type: 'number', required: true },
      { key: 'carrier', type: 'string', required: false },
      { key: 'tracking_number', type: 'string', required: false },
      { key: 'fulfillment_location_id', type: 'number', required: false },
      { key: 'merchant_order_reference', type: 'string', required: false },
      {
        key: 'cancel_reason',
        type: 'string',
        required: false,
        choices: [
          'CUSTOMER_REQUESTED',
          'OUT_OF_STOCK',
          'INVALID_ADDRESS',
          'SUSPICIOUS_ORDER',
          'CANCEL_REASON_OTHER',
        ],
      },
      { key: 'cancel_message', type: 'string', required: false },
      { key: 'refund_amount', type: 'number', required: false },
      {
        key: 'refund_reason',
        type: 'string',
        required: false,
        choices: [
          'BUYERS_REMORSE',
          'DAMAGED_GOODS',
          'NOT_AS_DESCRIBED',
          'QUALITY_ISSUE',
          'REFUND_REASON_OTHER',
          'WRONG_ITEM',
        ],
      },
      { key: 'action', type: 'string', required: true, choices: ['FULFILL', 'CANCEL', 'REFUND'] },
    ],
    sample: response,
  },
};
