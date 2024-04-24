// (c) Meta Platforms, Inc. and affiliates. Confidential and proprietary.

import { createAppTester, tools } from 'zapier-platform-core';
import App from '../index';
import nock from 'nock';
import { BASE_URL } from '../constants';

const appTester = createAppTester(App);

const order_id = '1234567890';
const sucessResponse = { success: true };

describe('creates objects', () => {
  test('Fulfill order items ', async () => {
    nock(BASE_URL).post(`/${order_id}/shipments`).query(true).reply(200, sucessResponse);
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
    });
    expect(result).toMatchObject(sucessResponse);
  });
  test('Update order items (Ship)', async () => {
    nock(BASE_URL).post(`/${order_id}/shipments`).query(true).reply(200, sucessResponse);
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
    });
    expect(result).toMatchObject(sucessResponse);
  });
  test('Update order items (Cancel)', async () => {
    nock(BASE_URL).post(`/${order_id}/cancellations`).query(true).reply(200, sucessResponse);
    const result = await appTester(App.creates.updateOrderItem.operation.perform, {
      inputData: {
        order_id: order_id,
        retailer_id: '123',
        quantity: 1,
        cancel_reason: 'CUSTOMER_REQUESTED' as const,
        action: 'CANCEL' as const,
      },
    });
    expect(result).toMatchObject(sucessResponse);
  });
  test('Update order items (Refund)', async () => {
    nock(BASE_URL).post(`/${order_id}/refunds`).query(true).reply(200, sucessResponse);
    const result = await appTester(App.creates.updateOrderItem.operation.perform, {
      inputData: {
        order_id: order_id,
        retailer_id: '123',
        quantity: 1,
        action: 'REFUND' as const,
        refund_reason: 'BUYERS_REMORSE',
      },
    });
    expect(result).toMatchObject(sucessResponse);
  });
});
