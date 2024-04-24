import { version as platformVersion } from 'zapier-platform-core';

import orders from './triggers/orders';
import orderItems from './triggers/orderItems';
import fulfillOrderItem from './creates/fulfillOrderItem';
import authentication from './authentication';
import { includeBearerToken, checkForErrors } from './middleware';
import cancelOrderItem from './creates/cancelOrderItem';
import refundOrderItem from './creates/refundOrderItem';
import updateOrderItem from './creates/updateOrderItem';

// @ts-ignore must use require
const { version } = require('../package.json');

export default {
  version,
  platformVersion,
  authentication,
  beforeRequest: [includeBearerToken],
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