/**
 * (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { CancellationReasonCode } from './CancellationReasonCode';

export type CancellationRequest = {
  cancel_reason?: {
    reason_code: CancellationReasonCode;
    reason_description?: string;
  };
  restock_items?: boolean;
  items: Array<{
    retailer_id?: string;
    item_id?: string;
    quantity: number;
  }>;
  idempotency_key: string;
};
