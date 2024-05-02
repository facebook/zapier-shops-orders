/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { BASE_URL } from '../constants';
import { v4 as uuidv4 } from 'uuid';

import response from '../samples/fulfillment-response.json';
import { Bundle, ZObject } from 'zapier-platform-core';
import { ShipmentRequest } from '../types/ShipmentRequest';
import { CommerceOrder, FacebookAdsApi } from 'facebook-nodejs-business-sdk';

export type Input = {
  order_id: string;
  external_shipment_id?: string;
  retailer_id: string;
  item_id?: string;
  quantity: number;
  tracking_number: string;
  // Supported carriers https://developers.facebook.com/docs/commerce-platform/order-management/carrier-codes
  carrier: string;
  shipping_method_name?: string;
  fulfillment_location_id?: string;
  merchant_order_reference?: string;
};

const perform = async (z: ZObject, bundle: Bundle<Input>) => {
  const {
    order_id,
    retailer_id,
    item_id,
    quantity,
    external_shipment_id,
    carrier,
    tracking_number,
    shipping_method_name,
    fulfillment_location_id,
    merchant_order_reference,
  } = bundle.inputData;
  const hasRetailerId = retailer_id != null && retailer_id.trim() !== '';
  const body: ShipmentRequest = {
    external_shipment_id: external_shipment_id ?? undefined,
    items: [
      {
        retailer_id: hasRetailerId ? retailer_id : undefined,
        item_id: !hasRetailerId ? item_id : undefined,
        quantity: quantity,
      },
    ],
    tracking_info: {
      carrier: carrier,
      tracking_number: tracking_number,
      shipping_method_name: shipping_method_name,
    },
    fulfillment: fulfillment_location_id
      ? {
          fulfillment_location_id: fulfillment_location_id,
        }
      : undefined,
    merchant_order_reference:
      merchant_order_reference !== '' ? merchant_order_reference : undefined,
    idempotency_key: uuidv4(),
  };
  FacebookAdsApi.init(bundle.authData.access_token);
  let order = new CommerceOrder(order_id);
  order = await order.createShipment([], body);
  return order._data;
};

export default {
  key: 'fulfillOrderItem',
  noun: 'Fulfill Order Item',
  display: {
    label: 'Fullfill Order Item',
    description: 'Fulfills (ships) an order item',
    hidden: false,
  },
  operation: {
    perform,
    inputFields: [
      { key: 'order_id', required: true },
      { key: 'retailer_id', type: 'string', required: true },
      { key: 'item_id', type: 'string', required: false },
      { key: 'quantity', type: 'integer', required: true },
      { key: 'external_shipment_id', required: false, type: 'string' },
      { key: 'carrier', type: 'string', required: true },
      { key: 'tracking_number', type: 'string', required: true },
      { key: 'shipping_method_name', type: 'string', required: false },
      { key: 'fulfillment_location_id', type: 'number', required: false },
      { key: 'merchant_order_reference', type: 'string', required: false },
    ],
    sample: response,
  },
};
