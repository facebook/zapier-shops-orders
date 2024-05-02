/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { version as platformVersion } from 'zapier-platform-core';

import orders from './triggers/orders';
import orderItems from './triggers/orderItems';
import fulfillOrderItem from './creates/fulfillOrderItem';
import authentication from './authentication';
import { checkForErrors } from './middleware';
import cancelOrderItem from './creates/cancelOrderItem';
import refundOrderItem from './creates/refundOrderItem';
import updateOrderItem from './creates/updateOrderItem';

// @ts-ignore must use require
const { version } = require('../package.json');

export default {
  version,
  platformVersion,
  authentication,
  beforeRequest: [],
  afterResponse: [checkForErrors],
  triggers: {
    orders: orders,
    orderItems: orderItems,
  },
  creates: {
    fulfillOrderItem: fulfillOrderItem,
    cancelOrderItem: cancelOrderItem,
    refundOrderItem: refundOrderItem,
    updateOrderItem: updateOrderItem,
  },
};
