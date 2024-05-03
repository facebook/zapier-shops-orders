/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createAppTester } from 'zapier-platform-core';
import App from '../index';
import nock from 'nock';
import get_order_response from './fixtures/responses/get_order_response.json';
import { BASE_URL } from '../constants';

const appTester = createAppTester(App);
const CMS_ID = '1750755323554341';
const ORDER_ID = '770609848507110';

describe('orders', () => {
  const bundle = {
    inputData: {
      cms_id: CMS_ID,
      state: ['IN_PROGRESS'],
    },
    authData: {
      access_token: 'dummy',
    },
  };

  test('get orders', async () => {
    nock(BASE_URL)
      .get(`/${CMS_ID}/commerce_orders`)
      .query(true)
      .reply(200, { data: [get_order_response] });

    const orders = await appTester(App.triggers.orders.operation.perform, bundle);
    expect(orders.length).toBeGreaterThan(0);
    expect(orders[0]).toMatchObject({
      id: ORDER_ID,
      created: '2024-04-17T23:04:34+00:00',
    });
  });
  test('get order items', async () => {
    nock(BASE_URL)
      .get(`/${CMS_ID}/commerce_orders`)
      .query(true)
      .reply(200, { data: [get_order_response] });

    const orderItems = await appTester(App.triggers.orderItems.operation.perform, bundle);
    expect(orderItems.length).toBeGreaterThan(0);
    expect(orderItems[0]).toMatchObject({
      id: '770609841840444',
      order_id: ORDER_ID,
      created: '2024-04-17T23:04:34+00:00',
    });
  });
});
