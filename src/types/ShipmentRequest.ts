/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

export type ShipmentRequest = {
  external_shipment_id?: string;
  items: Array<{
    retailer_id?: string;
    item_id?: string;
    quantity: number;
  }>;
  tracking_info: {
    tracking_number: string;
    carrier: string;
    shipping_method_name?: string;
  };
  fulfillment?: {
    fulfillment_location_id: string;
  };
  idempotency_key: string;
  merchant_order_reference?: string;
};
