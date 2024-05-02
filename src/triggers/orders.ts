/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import sample from '../samples/order.json';
import { Bundle, ZObject } from 'zapier-platform-core';
import {
  CommerceOrder,
  CommerceMerchantSettings,
  FacebookAdsApi,
} from 'facebook-nodejs-business-sdk';
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

const perform = async (_z: ZObject, bundle: Bundle<Input>) => {
  const { cms_id, state, filters, updated_before, updated_after } = bundle.inputData;
  const params: Record<any, any> = {
    state: state,
  };
  if (filters) {
    params.filters = filters;
  }
  if (updated_before) {
    params.updated_before = getUnixTime(updated_before);
  }
  if (updated_after) {
    params.updated_after = getUnixTime(updated_after);
  }

  FacebookAdsApi.init(bundle.authData.access_token);
  const cms = new CommerceMerchantSettings(cms_id);
  const orders = await cms.getCommerceOrders(
    [
      CommerceOrder.Fields.id,
      CommerceOrder.Fields.order_status,
      CommerceOrder.Fields.created,
      CommerceOrder.Fields.last_updated,
      CommerceOrder.Fields.channel,
      CommerceOrder.Fields.ship_by_date,
      CommerceOrder.Fields.merchant_order_id,
      CommerceOrder.Fields.selected_shipping_option,
      CommerceOrder.Fields.shipping_address,
      CommerceOrder.Fields.estimated_payment_details,
      CommerceOrder.Fields.buyer_details,
      'items',
    ],
    params
  );

  return orders.map((order) => (order as CommerceOrder)._data) as Order[];
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
        choices: CommerceOrder.State,
      },
      {
        key: 'filters',
        required: false,
        list: true,
        choices: CommerceOrder.Filters,
      },
      { key: 'updated_before', required: false, type: 'datetime' },
      { key: 'updated_after', required: false, type: 'datetime' },
    ],
    sample,
  },
};
