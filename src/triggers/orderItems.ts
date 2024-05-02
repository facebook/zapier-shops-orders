/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sample from '../samples/orderItem.json';
import { Bundle, ZObject } from 'zapier-platform-core';
import orders, { Input } from './orders';

const perform = async (z: ZObject, bundle: Bundle<Input>) => {
  const data = await orders.operation.perform(z, bundle);
  return data.flatMap((order) =>
    order.items.data.map((item) => {
      return {
        ...item,
        order_id: order.id,
        order_status: order.order_status,
        created: order.created,
        channel: order.channel,
        selected_shipping_option: order.selected_shipping_option,
        shipping_address: order.shipping_address,
        estimated_payment_details: order.estimated_payment_details,
        buyer_details: order.buyer_details,
      };
    })
  );
};

export default {
  key: 'orderItems',
  noun: 'OrderItems',
  display: {
    label: 'Order Items',
    description:
      'Triggers when a new order item is created. Every record represents an order item.',
    hidden: false,
  },
  operation: {
    perform,
    inputFields: orders.operation.inputFields,
    sample,
  },
};
