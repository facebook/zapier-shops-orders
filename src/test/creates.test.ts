/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createAppTester, tools } from 'zapier-platform-core';
import App from '../index';
import nock from 'nock';
import { BASE_URL } from '../constants';

const appTester = createAppTester(App);

const order_id = '1234567890';
const successResponse = { success: true };
const authData = {
  access_token: 'dummy',
};

describe('creates objects', () => {
  test('Fulfill order items ', async () => {
    nock(BASE_URL).post(`/${order_id}/shipments`).query(true).reply(200, successResponse);
    const result = await appTester(App.creates.fulfillOrderItem.operation.perform, {
      inputData: {
        order_id: order_id,
        retailer_id: '123',
        quantity: 1,
        tracking_number: '123456789',
        carrier: 'USPS',
        external_shipment_id: '123456789',
        shipping_method_name: '1 Day Delivery',
        fulfillment_location_id: '1',
        merchant_order_reference: '12345',
      },
      authData,
    });
    expect(result).toMatchObject(successResponse);
  });
  test('Update order items (Ship)', async () => {
    nock(BASE_URL).post(`/${order_id}/shipments`).query(true).reply(200, successResponse);
    const result = await appTester(App.creates.updateOrderItem.operation.perform, {
      inputData: {
        order_id: order_id,
        retailer_id: '123',
        quantity: 1,
        tracking_number: '123456789',
        carrier: 'USPS',
        fulfillment_location_id: '1',
        merchant_order_reference: '12345',
        action: 'FULFILL' as const,
      },
      authData,
    });
    expect(result).toMatchObject(successResponse);
  });
  test('Update order items (Cancel)', async () => {
    nock(BASE_URL).post(`/${order_id}/cancellations`).query(true).reply(200, successResponse);
    const result = await appTester(App.creates.updateOrderItem.operation.perform, {
      inputData: {
        order_id: order_id,
        retailer_id: '123',
        quantity: 1,
        cancel_reason: 'CUSTOMER_REQUESTED' as const,
        action: 'CANCEL' as const,
      },
      authData,
    });
    expect(result).toMatchObject(successResponse);
  });
  test('Update order items (Refund)', async () => {
    nock(BASE_URL).post(`/${order_id}/refunds`).query(true).reply(200, successResponse);
    const result = await appTester(App.creates.updateOrderItem.operation.perform, {
      inputData: {
        order_id: order_id,
        retailer_id: '123',
        quantity: 1,
        action: 'REFUND' as const,
        refund_reason: 'BUYERS_REMORSE',
      },
      authData,
    });
    expect(result).toMatchObject(successResponse);
  });
});
