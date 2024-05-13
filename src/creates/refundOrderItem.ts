/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BASE_URL } from '../constants';
import { v4 as uuidv4 } from 'uuid';

import response from '../samples/update-response.json';
import { Bundle, ZObject } from 'zapier-platform-core';
import { RefundRequest } from '../types/RefundRequest';
import { RefundReasonCode } from '../types/RefundReasonCode';
import { CommerceOrder, FacebookAdsApi } from 'facebook-nodejs-business-sdk';

export type Input = {
  order_id: string;
  retailer_id: string;
  item_id?: string;
  item_refund_quantity?: number;
  item_refund_amount?: number;
  reason_code: RefundReasonCode;
  reason_text?: string;
  shipping_refund_amount?: number;
  deduction_amount?: number;
  refund_id?: string;
};

const perform = async (z: ZObject, bundle: Bundle<Input>) => {
  const {
    order_id,
    retailer_id,
    item_id,
    item_refund_quantity,
    item_refund_amount,
    reason_code,
    reason_text,
    shipping_refund_amount,
    deduction_amount,
    refund_id,
  } = bundle.inputData;
  const hasRetailerId = retailer_id != null && retailer_id.trim() !== '';
  const body: RefundRequest = {
    items: [
      {
        retailer_id: hasRetailerId ? retailer_id : undefined,
        item_id: !hasRetailerId ? item_id : undefined,
        item_refund_quantity: item_refund_quantity,
        item_refund_amount:
          item_refund_amount != null
            ? {
                amount: item_refund_amount,
                currency: 'USD',
              }
            : undefined,
      },
    ],
    reason_code: reason_code,
    reason_text: reason_text,
    idempotency_key: uuidv4(),
    shipping:
      shipping_refund_amount != null
        ? {
            shipping_refund: {
              amount: shipping_refund_amount,
              currency: 'USD',
            },
          }
        : undefined,
    deductions:
      deduction_amount != null
        ? {
            deduction_type: 'RETURN_SHIPPING',
            deduction_amount: {
              amount: deduction_amount,
              currency: 'USD',
            },
          }
        : undefined,
    return_id: refund_id,
  };

  FacebookAdsApi.init(bundle.authData.access_token);
  let order = new CommerceOrder(order_id);
  order = await order.createRefund([], body);
  return order._data;
};

export default {
  key: 'refundOrderItem',
  noun: 'Refund Order Item',
  display: {
    label: 'Refund Order Item',
    description: 'Refunds an order item.',
    hidden: false,
  },
  operation: {
    perform,
    inputFields: [
      { key: 'order_id', required: true },
      { key: 'retailer_id', type: 'string', required: true },
      { key: 'item_id', type: 'string', required: false },
      { key: 'item_refund_quantity', type: 'integer', required: false },
      { key: 'item_refund_amount', type: 'number', required: false },
      {
        key: 'reason_code',
        type: 'string',
        required: true,
        choices: [
          'BUYERS_REMORSE',
          'DAMAGED_GOODS',
          'NOT_AS_DESCRIBED',
          'QUALITY_ISSUE',
          'REFUND_REASON_OTHER',
          'WRONG_ITEM',
        ],
      },
      { key: 'reason_text', type: 'string', required: false },
      { key: 'shipping_refund_amount', type: 'number', required: false },
      { key: 'deduction_amount', type: 'number', required: false },
      { key: 'refund_id', type: 'string', required: false },
    ],
    sample: response,
  },
};
