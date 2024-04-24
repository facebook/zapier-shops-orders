// (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.

import sample from '../samples/order.json';
import { BASE_URL } from '../constants';
import { Bundle, ZObject } from 'zapier-platform-core';
import { Order } from '../types/Order';

export type Input = {
  cms_id: string;
  state: Array<string>;
  filters?: Array<string>;
  updated_before?: string;
  updated_after?: string;
};

const getUnixTime = (dateString?: string): number | undefined => {
  if (dateString) {
    try {
      const date = new Date(dateString);
      return Math.floor(date.getTime() / 1000);
    } catch (error) {}
  }
};

const perform = async (z: ZObject, bundle: Bundle<Input>) => {
  const { cms_id, state, filters, updated_before, updated_after } = bundle.inputData;
  const params = {
    fields:
      'id,order_status,created,last_updated,items,channel,ship_by_date,merchant_order_id,selected_shipping_option,shipping_address,estimated_payment_details,buyer_details',
    state: state.toString(),
    filters: filters?.toString(),
    updated_before: getUnixTime(updated_before),
    updated_after: getUnixTime(updated_after),
  };
  const response = await z.request({
    url: `${BASE_URL}/${cms_id}/commerce_orders`,
    params: params,
    headers: {
      prefixErrorMessageWith: 'Unable to retrieve your Meta Shop orders',
    },
  });

  return response.json.data as Array<Order>;
};

export default {
  key: 'orders',
  noun: 'Orders',
  display: {
    label: 'Orders',
    description:
      'Triggers when a new order is created. Every record represents an order. Item Ids and quantities will be separated by comma.',
    hidden: false,
  },
  operation: {
    perform,
    inputFields: [
      { key: 'cms_id', required: true },
      {
        key: 'state',
        required: false,
        list: true,
        default: 'IN_PROGRESS',
        choices: {
          FB_PROCESSING: 'Processing',
          CREATED: 'Created',
          IN_PROGRESS: 'In Progress',
          COMPLETED: 'Completed',
        },
      },
      {
        key: 'filters',
        required: false,
        list: true,
        choices: {
          no_shipments: 'No shipments',
          has_cancellations: 'Has cancellations',
          no_cancellations: 'No cancellations',
          has_refunds: 'Has refunds',
          no_refunds: 'No refunds',
        },
      },
      { key: 'updated_before', required: false, type: 'datetime' },
      { key: 'updated_after', required: false, type: 'datetime' },
    ],
    sample,
  },
};
